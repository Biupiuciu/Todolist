import type { NextApiHandler } from "next";
import userPool from "@/lib/cognito";
import { CognitoUser } from "amazon-cognito-identity-js";
import { HttpStatus } from "@/utils/httpStatus";
const resendcode: NextApiHandler = async (req, res) => {
  const { email } = req.body;
  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: userPool,
  });

  cognitoUser.resendConfirmationCode((err, result) => {
    if (err) {
      console.log("! ", err.message);
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
    console.log(result);
    return res.status(HttpStatus.OK).json({ message: result });
  });
};

export default resendcode;
