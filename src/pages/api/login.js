
import { setCookie } from 'cookies-next';
const {getLoginInfo}=require('/database');
const {generateAccessToken,generateRefreshToken}=require('/server');

const login = async(req,res) => {
    const{username,psd}=req.body;
    try{
      const result=await getLoginInfo(username);

      //can't find the user or passwork incorrect
      if(!result||psd!==result.pwd){
        res.json("Unauthorized").status(401);
        return;
      }
      
      const accessToken=await generateAccessToken(result.id);
      const refreshToken=await generateRefreshToken(result.id);
      setCookie('refreshToken', refreshToken, {
        req,
        res,
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 14 * 24 * 60 * 60 // 7天
      });
      //send the access token to front end and set the http only cookie for storing refreshToken
      res.status(201)
    //   cookie('refreshToken',refreshToken,{
    //         httpOnly: true,
    //         secure: true,  
    //         sameSite: 'None',
    //         maxAge: 14 * 24 * 60 * 60 * 1000 // 7 天cor
    //       })
          .json({accessToken,id:result.id});

    }catch(err){
        console.log(err);
    }
}

export default login