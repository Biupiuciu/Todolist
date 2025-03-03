import type { NextApiHandler } from "next";
import userPool from "@/lib/cognito";
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserSession,
} from "amazon-cognito-identity-js";
import { HttpStatus } from "@/utils/httpStatus";

const login: NextApiHandler = async (req, res) => {
  const { email, psd } = req.body;

  const authenticationDetails = new AuthenticationDetails({
    Username: email,
    Password: psd,
  });

  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: userPool,
  });

  try {
    await new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (session: CognitoUserSession) => {
          const refreshToken = session.getRefreshToken().getToken();
          res.setHeader(
            "Set-Cookie",
            `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000; Path=/`
          ); // Set the cookie for 30 days

          res
            .status(HttpStatus.OK)
            .json({ message: "Log in successfully.", username: email });
          resolve(null);
        },
        onFailure: (err) => {
          if (err.code == "UserNotConfirmedException") {
            res
              .status(HttpStatus.BAD_REQUEST)
              .json({ message: err.message, userNotConfirmed: true });
          }
          res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
          reject(err);
        },
      });
    });
  } catch (err) {
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
};

export default login;
