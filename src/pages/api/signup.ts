
import type { NextApiHandler } from "next";
import bcrypt from "bcrypt";
import {pool} from "../../../database";
import { UserAPI } from "@/stores/users";
const signup: NextApiHandler = async (req, res) => {
  const { username, psd } = req.body;

  try {
   
    const { rows } = await pool.query(
      `SELECT * FROM users WHERE username = '${username}'`,
    );
    const noDuplicateUserName=rows.length == 0;

    if (!noDuplicateUserName) {
      res.status(401).json("Username Duplicate");
      return;
    }

    const hashedPwd=await bcrypt.hash(psd, 10);

    const result =
      await pool.query(`INSERT INTO users (username, pwd, tasks,taskNum) 
        VALUES ('${username}', '${hashedPwd}', '[{"tasks": [ {"id": "0", "content": "Task1"}], "title": "To do"}, {"tasks": [], "title": "In progress"}, {"tasks": [], "title": "Done"}]',1) RETURNING id;;`);

    const { rowCount } = result;

    if (rowCount != 1||!result) {
     
        res.status(401).json("SignUpFailed");
        return;
      
    }

    const accessToken = await UserAPI.generateAccessToken(result.rows[0].id);
    
    res.status(201).json({ accessToken});

  } catch (err) {

    console.log(err);
    res.status(500).json("error");
  }
};

export default signup;
