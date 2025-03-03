import type { NextApiHandler } from "next";
import userPool from "@/lib/cognito";
import getUserId from "@/lib/repositories/userRepo";
import { HttpStatus } from "@/utils/httpStatus";
import { CognitoRefreshToken, CognitoUser } from "amazon-cognito-identity-js";

const handler: NextApiHandler = async (req, res) => {
  const { savedUsername } = req.body;

  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken && !savedUsername) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: "no login info" });
  }
  const cognitoUser = new CognitoUser({
    Username: savedUsername,
    Pool: userPool,
  });

  const refreshTokenObj = new CognitoRefreshToken({
    RefreshToken: refreshToken as string,
  });

  cognitoUser.refreshSession(refreshTokenObj, async (err, newSession) => {
    if (err) {
      console.log("1");
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
    const refreshToken = newSession.getRefreshToken().getToken();
    res.setHeader(
      "Set-Cookie",
      `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000;Path=/`
    ); // 30 days
    const username = newSession.getIdToken().payload.email;

    const id = await getUserId(username);

    if (!id) {
      console.log("3");
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Internal Error" });
    }
    return res.status(HttpStatus.OK).json({ username: username, id: id });
  });
};

export default handler;
