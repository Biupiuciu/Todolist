// const {createUser}=require('/database');
// const {generateAccessToken,generateRefreshToken}=require('/server');
import { setCookie } from "cookies-next";
import { createUser, checkDuplicateUserName } from "../../../database";
import { generateAccessToken, generateRefreshToken } from "../../../server";
import type { NextApiHandler} from 'next';
import bcrypt from "bcrypt";

const signup:NextApiHandler = async (req, res) => {
  const { username, psd } = req.body;
 
  try {
    const noDuplicateUserName = await checkDuplicateUserName(username);
    if (!noDuplicateUserName) {
      res.status(401).json("Username Duplicate");
      return;
    }

    bcrypt.hash(psd, 10, async (err, hashedPwd) => {
      if (err) {
        console.log("unable to create hashed PWD");
        throw new Error();
      }

      const result = await createUser(username, hashedPwd);

      if (!result) {
        res.status(401).json("SignUpFailed");
        return;
      }

      console.log("Created:", result);

      const accessToken = await generateAccessToken(result);
      const refreshToken = await generateRefreshToken(result);

      setCookie("refreshToken", refreshToken, {
        req,
        res,
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 14 * 24 * 60 * 60, // 7天
      });
      res.status(201).json({ accessToken, id: result });
    });
  } catch (err) {
    // console.log(err[0])
    console.log(err);
    res.status(500).json("error");
  }
};

export default signup;
