import type { NextApiHandler } from "next";
import userPool from "@/lib/cognito";
import { CognitoUser } from "amazon-cognito-identity-js";
import { HttpStatus } from "@/utils/httpStatus";
import { pool } from "@/lib/database";
const verifysignup: NextApiHandler = async (req, res) => {
  const { email, code } = req.body;

  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: userPool,
  });

  cognitoUser.confirmRegistration(code, false, async (err) => {
    if (err) {
      console.log(err.message);
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }

    const dbResult =
      await pool.query(`INSERT INTO users (username,  tasks,taskNum) 
            VALUES ('${email}', '[{"tasks": [ {"id": "0", "content": "Task1"}], "title": "To do"}, {"tasks": [], "title": "In progress"}, {"tasks": [], "title": "Done"}]',1) RETURNING id;;`);

    const { rowCount } = dbResult;

    if (rowCount != 1 || !dbResult) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Sign up failed. Please register again." });
      // need to handle it later on
    }

    res.status(HttpStatus.CREATED).json({ message: "Account created." });
  });
};

export default verifysignup;
