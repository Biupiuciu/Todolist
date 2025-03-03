import type { NextApiHandler } from "next";
import userPool from "@/lib/cognito";
import { CognitoUser, CognitoRefreshToken } from "amazon-cognito-identity-js";
import { HttpStatus } from "@/utils/httpStatus";
import "dotenv/config";
const refreshtoken: NextApiHandler = async (req, res) => {
  // console.log(req);
  // if (req.method === "POST") {
  const { email } = req.body;

  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(HttpStatus.UNAUTHORIZED).json("Refresh token is missing");
  }

  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: userPool,
  });

  const refreshTokenObj = new CognitoRefreshToken({
    RefreshToken: refreshToken,
  });

  try {
    cognitoUser.refreshSession(refreshTokenObj, (err, session) => {
      if (err) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: err.message });
      }

      const accessToken = session.getAccessToken().getJwtToken();
      return res.status(HttpStatus.OK).json({ accessToken: accessToken });
    });
  } catch (err) {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: "Session expired. Please log in again." });
  }
  // }
  // console.log("??");
  // return res.status(405).json({ message: "Method Not Allowed!" });
};

export default refreshtoken;
