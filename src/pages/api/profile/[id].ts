import { pool } from "../../../lib/database";
import type { NextApiHandler, NextApiRequest, NextApiResponse  } from "next";
import jwt from "jsonwebtoken";
import type {Decoded} from "../profile/index";


const withAuth=(handler:NextApiHandler):NextApiHandler=>{
return async(req:NextApiRequest,res:NextApiResponse)=>{

  console.log("WITHAUTHO...");
  const { id } = req.query;
   const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1].replace(/^"|"$/g, "");
  
        if (!token) {
          return res.status(401).json({ message: "No token provided" });
        }
        const accessTokenKey =process.env.ACCESS_TOKEN_PRIVATE_KEY;
        if (!accessTokenKey) {
          return res.status(401).json({ message: "environment variable is not set" });
        }
  
        jwt.verify(token, accessTokenKey, (err, decoded) => {
          if (err) {
            if (err instanceof jwt.TokenExpiredError) {
              return res.status(401).json({ message: "Token has expired" });
            } else if (err instanceof jwt.JsonWebTokenError) {
              return res.status(401).json({ message: "Invalid token" });
            } else {
              return res.status(401).json({ message: "Token verification failed" });
            }
          }
          if(!decoded) throw new Error("decoded failed");
  
          console.log("DECODED:", decoded);
          const {_id}=decoded as Decoded;
          if(id==_id)
            return handler(req, res); 
        });
};
};
const handler: NextApiHandler = async (req, res) => {
 
  
    if (req.method == "GET") {
      const { id } = req.query;
      const {rows}=await pool.query(`SELECT tasks,tasknum from users WHERE id=${id}`);

      if (rows.length!=1) {
        throw new Error("Can't find tasks");
      }
     console.log("GET LIST...");

     return res.json({lists:rows[0].tasks,taskNum:rows[0].tasknum});
    }else if(req.method == "PUT"){
      const { id } = req.query;
      console.log(req.body);
      const {todoList,addNewTask}=req.body;
      const formatedList=JSON.stringify(todoList);
     
      const queryRequest = addNewTask
      ? `UPDATE users SET taskNum=taskNum+1,tasks ='${formatedList} ' WHERE id = '${id}'`
      : `UPDATE users SET tasks ='${formatedList} ' WHERE id = '${id}'`;
    const result = await pool.query(queryRequest);

    if(result.rowCount!=1){
      return res.status(400).json("failed");
    }

    return res.status(200).json("succeed");
    }
 
};

export default withAuth(handler);
