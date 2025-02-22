import type { NextApiHandler } from "next";
import userPool from "@/lib/cognito";
import { HttpStatus } from "@/utils/httpStatus";

const logout: NextApiHandler = async (req, res) => {
  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser) {
    cognitoUser.signOut();
    res.setHeader(
      "Set-Cookie",
      "refreshToken=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/;"
    );
    res.status(HttpStatus.OK).json({ message: "Log out." });
  }

  res.status(HttpStatus.BAD_REQUEST).json({ message: "User session invalid." });
};

export default logout;
