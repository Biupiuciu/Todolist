import type { NextApiHandler } from "next";
import userPool from "@/lib/cognito";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import { HttpStatus } from "@/utils/httpStatus";
const signup: NextApiHandler = async (req, res) => {
  const { email, psd } = req.body;
  console.log("REGI ", email, " ", psd);
  const attributeList = [
    new CognitoUserAttribute({ Name: "email", Value: email }),
  ];

  userPool.signUp(email, psd, attributeList, [], (err, result) => {
    if (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }

    return res.status(HttpStatus.CREATED).json({
      message: "Verificaton code sent",
      username: result?.user.getUsername(),
    });
  });
};

export default signup;
