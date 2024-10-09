import React from 'react'
const jwt=require("jsonwebtoken");
const {generateAccessToken}=require('/server');
require('dotenv').config();
const refreshTokenKey=process.env.REFRESH_TOKEN_PRIVATE_KEY;

const refreshToken =async (req,res) => {
    const refreshToken=req.cookies.refreshToken;
    if(!refreshToken){
      console.log('No cookies found');
      res.status(401).json('Invalid or missing authentication token');
      return;
    }
    jwt.verify(refreshToken,refreshTokenKey,async(err,decoded)=>{
      if(err){
        res.status(401).json('Invalid or missing authentication token');
        return;
      }
      
      const accessToken=await generateAccessToken(decoded._id);
      res.status(201).json({accessToken,id:decoded._id});
      
    
    })
  
}

export default refreshToken