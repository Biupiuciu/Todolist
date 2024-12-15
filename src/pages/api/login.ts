
import {pool} from "../../../database";
import { UserAPI } from "@/stores/users";
import type { NextApiHandler } from "next";
import bcrypt from "bcrypt";
const login: NextApiHandler = async (req, res) => {
  const { username, psd } = req.body;
  try {

    const { rows } = await pool.query(
      `SELECT id, pwd FROM users WHERE username = '${username}'`,
    );
    if (rows.length!=1) {
      throw new Error("Can't find user");
    }


    const isMatch = await bcrypt.compare(psd,rows[0].pwd);

    if(!isMatch){
      throw new Error("unMatched");
    }
    const accessToken = await UserAPI.generateAccessToken(rows[0].id);

    res
      .status(201)
      .json({ accessToken });

  } catch (err) {
    console.log(err);
  }
};

export default login;
