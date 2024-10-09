
import * as dotenv from 'dotenv';
dotenv.config();
const accessTokenKey=process.env.ACCESS_TOKEN_PRIVATE_KEY;
// const {getLogInTasks,updateTasks}=require('/database');
import { getLogInTasks,updateTasks } from '../../../../database';
import jwt from 'jsonwebtoken';

export const profileMiddleware = (req, res, next) => {
  const authHeader=req.headers;
  const accessToken=authHeader.authorization.split(' ')[1];
  
 jwt.verify(accessToken,accessTokenKey,(err,decoded)=>{
 
  
   if(err){
     if(err.message=='jwt expired'){
      console.log('Expired token');
       return res.status(401).json('Expired token');
     }
     console.log('1:',err.message);
     return res.status(401).json('Invalid token'); 
   }
 
   //for send the ID to frontend 
   req.id=decoded._id;
   next();
 });
};

export const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      resolve(result);
    });
  });
};

const handler=async(req, res)=> {
    await runMiddleware(req, res, profileMiddleware);
    const { id } = req.query; 
    if (req.method === 'GET') {
    
        try{
          const result=await getLogInTasks(id);
         
          res.json({id:req.id,tasks:result.tasks,taskNum:result.taskNum});
        }catch(err){
          console.log(err);
        }
      
    }
    if (req.method === 'POST') {
  
      const lists=req.body;
 
      try{
        const result=await updateTasks(id,lists);
        
       if(result>0){
        res.status(200).send('Modify Succeeded');
        return;
       }
       res.status(500).send('Server error');
      }catch(err){
        console.log(err);
        res.status(500).send('Server error');
      }
    
    }
}



export default handler;

