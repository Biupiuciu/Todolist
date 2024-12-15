import jwt from "jsonwebtoken";
// import { runMiddleware, profileMiddleware } from "./[id]";
import type { NextApiHandler } from "next";
import {pool} from '../../../../database';
const accessTokenKey = process.env.ACCESS_TOKEN_PRIVATE_KEY;
export interface Decoded {
  _id?:  number;
  // Add other fields that you expect in the decoded payload
}
const handler: NextApiHandler = async (req, res) => {
  // await runMiddleware(req, res, profileMiddleware);
  // const { id } = req.body;
  // if (id) {
  //   res.status(200).json({ id: id });
  // }

  let id:number|undefined;
    if (req.method == "GET") {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1].replace(/^"|"$/g, "");

      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      if (!accessTokenKey) {
        throw new Error(
          "ACCESS_TOKEN_PRIVATE_KEY environment variable is not set.",
        );
      }

      jwt.verify(token, accessTokenKey, (err, decoded) => {
        if (err) {
          if (err instanceof jwt.TokenExpiredError) {
            console.error("Token has expired");
          } else if (err instanceof jwt.JsonWebTokenError) {
            console.error("Invalid token:", err.message);
          } else {
            console.error("Token verification failed:", err);
          }
        }
        if(!decoded) throw new Error("decoded failed");

        console.log("DECODED:", decoded);
        const {_id}=decoded as Decoded;
        id=_id;
       
      });


      const { rows } = await pool.query(
        `SELECT username FROM users WHERE id = '${id}'`,
      );
      if (rows.length!=1) {
        throw new Error("Can't find tasks");
      }
      
      return res.json({id:id,username:rows[0].username});

     
    }
 
};

export default handler;
