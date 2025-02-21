import type { NextApiHandler } from "next";
import userPool from "@/lib/cognito";
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { HttpStatus } from "@/utils/httpStatus";

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

  try {
    await new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (session) => {
          const refreshToken = session.getRefreshToken().getToken();
          res.setHeader(
            "Set-Cookie",
            `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000; Path=/`
          ); // Set the cookie for 30 days

          res
            .status(HttpStatus.OK)
            .json({ message: "Log in successfully.", username: email });
          resolve(null); // Resolve when successful
        },
        onFailure: (err) => {
          res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
          reject(err); // Reject if there is an error
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
