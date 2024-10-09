
// const {createUser}=require('/database');
// const {generateAccessToken,generateRefreshToken}=require('/server');
import { createUser } from '../../../database';
import { generateAccessToken,generateRefreshToken } from '../../../server';
const signup =async (req,res) => {
   
    
    try{
        const result=await createUser(username,psd);
        console.log(result);
        if(!result){
          res.json("SignUpFailed").status(401);
          return;
        }
        if(result=='ER_DUP_ENTRY'){
          res.json("Username Duplicate").status(401);
          return;
        }
        const accessToken=await generateAccessToken(result);
          const refreshToken=await generateRefreshToken(result);
          res .cookie('refreshToken',refreshToken,{
            httpOnly: true,
            secure: true,  
            sameSite: 'None',
            maxAge: 14 * 24 * 60 * 60 * 1000 // 7 天cor
          })
          .status(201)
          .json({accessToken,id:result});
    
      }catch(err){
        // console.log(err[0])
      }
}

export default signup