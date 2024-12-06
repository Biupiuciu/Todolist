import * as dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
// const jwt=require("jsonwebtoken");
import { generateAccessToken } from "../../../server";
import type { NextApiHandler} from 'next';
// const {generateAccessToken}=require('/server');
// require('dotenv').config();
interface Decoded{
  _id: String | Number
}
const refreshTokenKey = process.env.REFRESH_TOKEN_PRIVATE_KEY as string;;

const refreshToken:NextApiHandler = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    console.log("No cookies found");
    res.status(401).json("Invalid or missing authentication token");
    return;
  }
  jwt.verify(refreshToken, refreshTokenKey, async (err, decoded) => {
    if (err) {
      res.status(401).json("Invalid or missing authentication token");
      return;
    }
if (decoded){
  const decodedPayload = decoded as Decoded;
  const accessToken = await generateAccessToken(decodedPayload._id);
  res.status(201).json({ accessToken, id: decodedPayload._id });
}
    
  });
};

export default refreshToken;
