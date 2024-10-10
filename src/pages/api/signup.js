
// const {createUser}=require('/database');
// const {generateAccessToken,generateRefreshToken}=require('/server');
import { setCookie } from 'cookies-next';
import { createUser } from '../../../database';
import { generateAccessToken,generateRefreshToken } from '../../../server';
const signup =async (req,res) => {
  const{username,psd}=req.body;
    
    try{
        console.log('signup');
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
         
          setCookie('refreshToken', refreshToken, {
            req,
            res,
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 14 * 24 * 60 * 60 // 7天
          });
          res 
          .status(201)
          .json({accessToken,id:result});
    
      }catch(err){
        // console.log(err[0])
        console.log(err)
        res.status(500).json( 'error' );
      }
}

export default signup