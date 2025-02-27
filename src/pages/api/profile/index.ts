import type { NextApiHandler } from "next";
import userPool from "@/lib/cognito";
import getUserId from "@/lib/repositories/userRepo";
import { HttpStatus } from "@/utils/httpStatus";
import {
  CognitoRefreshToken,
  CognitoUserSession,
} from "amazon-cognito-identity-js";

const handler: NextApiHandler = async (req, res) => {
  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser) {
    cognitoUser.getSession((err: Error | null, session: CognitoUserSession) => {
      if (err) {
        console.log("error1");
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: err.message });
      }
      const refreshToken = session.getRefreshToken().getToken();
      const refreshTokenObj = new CognitoRefreshToken({
        RefreshToken: refreshToken,
      });
      cognitoUser.refreshSession(refreshTokenObj, async (err, newSession) => {
        if (err) {
          return res
            .status(HttpStatus.BAD_REQUEST)
            .json({ message: err.message });
        }

        const refreshToken = newSession.getRefreshToken().getToken();
        res.setHeader(
          "Set-Cookie",
          `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000`
        ); // 30 days

        const username = newSession.getIdToken().payload.email;
        const id = await getUserId(username);

        if (!id) {
          return res
            .status(HttpStatus.BAD_REQUEST)
            .json({ message: "Internal Error" });
        }
        console.log("/profile...", { username: username, id: id });
        return res.status(HttpStatus.OK).json({ username: username, id: id });
      });
    });
  } else {
    console.log("error4!");
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: "Internal Error" });
  }
};

export default handler;
