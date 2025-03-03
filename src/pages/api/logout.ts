import type { NextApiHandler } from "next";
import userPool from "@/lib/cognito";
import { HttpStatus } from "@/utils/httpStatus";
import { CognitoUser } from "amazon-cognito-identity-js";

const logout: NextApiHandler = async (req, res) => {
  const username = req.body;

  const cognitoUser = new CognitoUser({
    Username: username,
    Pool: userPool,
  });

  if (cognitoUser) {
    cognitoUser.signOut();
    res.setHeader(
      "Set-Cookie",
      "refreshToken=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/;"
    );
    return res.status(HttpStatus.OK).json({ message: "Log out." });
  }

  return res
    .status(HttpStatus.BAD_REQUEST)
    .json({ message: "User session invalid." });
};

export default logout;
