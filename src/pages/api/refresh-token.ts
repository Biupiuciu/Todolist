import type { NextApiHandler } from "next";
import userPool from "@/lib/cognito";
import { CognitoUser, CognitoRefreshToken } from "amazon-cognito-identity-js";
import { HttpStatus } from "@/utils/httpStatus";
import "dotenv/config";
const verifysignup: NextApiHandler = async (req, res) => {
  const { email } = req.body;

  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(HttpStatus.UNAUTHORIZED).json("Refresh token is missing");
  }

  var cognitoUser = new CognitoUser({
    Username: email,
    Pool: userPool,
  });

  const refreshTokenObj = new CognitoRefreshToken({
    RefreshToken: refreshToken,
  });

  cognitoUser.refreshSession(refreshTokenObj, (err, session) => {
    if (err) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: err.message });
    }

    const accessToken = session.getAccessToken().getJwtToken();

    return res.status(HttpStatus.OK).json({ accessToken: accessToken });
  });
};

export default verifysignup;
