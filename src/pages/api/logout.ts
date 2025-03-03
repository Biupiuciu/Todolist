import type { NextApiHandler } from "next";
import userPool from "@/lib/cognito";
import { HttpStatus } from "@/utils/httpStatus";
import { CognitoUser } from "amazon-cognito-identity-js";

const logout: NextApiHandler = async (req, res) => {
  const username = req.body;

  console.log(username);
  const cognitoUser = new CognitoUser({
    Username: username,
    Pool: userPool,
  });

  console.log(cognitoUser);

  if (cognitoUser) {
    console.log("111");
    cognitoUser.signOut();
    res.setHeader(
      "Set-Cookie",
      "refreshToken=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/;"
    );
    console.log("222");
    return res.status(HttpStatus.OK).json({ message: "Log out." });
  }

  return res
    .status(HttpStatus.BAD_REQUEST)
    .json({ message: "User session invalid." });
};

export default logout;
