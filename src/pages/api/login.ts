import type { NextApiHandler } from "next";
import userPool from "@/lib/cognito";
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { HttpStatus } from "@/utils/httpStatus";
import { cookies } from "next/headers";
const login: NextApiHandler = async (req, res) => {
  const { email, psd } = req.body;
  const authenticationDetails = new AuthenticationDetails({
    Username: email,
    Password: psd,
  });

  var cognitoUser = new CognitoUser({
    Username: email,
    Pool: userPool,
  });

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: (session) => {
      const refreshToken = session.getRefreshToken().getToken();
      res.setHeader(
        "Set-Cookie",
        `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000`
      ); // 30 days

      return res
        .status(HttpStatus.OK)
        .json({ message: "Log in successfully.", username: email });
    },
    onFailure: (err) => {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    },
  });
};

export default login;
