// const express=require("express");
// const app=express();
// const cors=require('cors');
// const cookieParser = require('cookie-parser');
// require('dotenv').config();
// const bodyParser=require("body-parser");
// const { getLogInTasks,getLoginInfo,updateTasks,createUser} = require('./database');

// app.use(bodyParser.json()).use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.json());
// app.use(cors({
//   origin:'http://localhost:3000',
//   credentials: true,
//   methods:['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));

const jwt=require("jsonwebtoken");
const accessTokenKey=process.env.ACCESS_TOKEN_PRIVATE_KEY;
const refreshTokenKey=process.env.REFRESH_TOKEN_PRIVATE_KEY;

const generateAccessToken=async(id)=>{
    const payload={_id:id};
    const accessToken=jwt.sign(payload,accessTokenKey,{expiresIn:'5s'});
    const now=new Date();
    // const currentTime=now.getTime()+14 * 60 * 1000;
    const currentTime=now.getTime()+5 * 1000;
    return {value:accessToken,expiry:currentTime};
}

const generateRefreshToken=async(id)=>{
  const payload={_id:id};
  const refreshToken=jwt.sign(payload,refreshTokenKey,{expiresIn:'14d'});
  return refreshToken;
}

// app.post('/signup',async(req,res)=>{
//   const{username,psd}=req.body;
  
//   try{
//     const result=await createUser(username,psd);
//     console.log(result);
//     if(!result){
//       res.json("SignUpFailed").status(401);
//       return;
//     }
//     if(result=='ER_DUP_ENTRY'){
//       res.json("Username Duplicate").status(401);
//       return;
//     }
//     const accessToken=await generateAccessToken(result);
//       const refreshToken=await generateRefreshToken(result);
//       res .cookie('refreshToken',refreshToken,{
//         httpOnly: true,
//         secure: true,  
//         sameSite: 'None',
//         maxAge: 14 * 24 * 60 * 60 * 1000 // 7 天cor
//       })
//       .status(201)
//       .json({accessToken,id:result});

//   }catch(err){
//     // console.log(err[0])
//   }
// })

// app.post("/login",async(req,res)=>{

//     const{username,psd}=req.body;
//     try{
//       const result=await getLoginInfo(username);

//       //can't find the user or passwork incorrect
//       if(!result||psd!==result.pwd){
//         res.json("Unauthorized").status(401);
//         return;
//       }
      
//       const accessToken=await generateAccessToken(result.id);
//       const refreshToken=await generateRefreshToken(result.id);
     
//       //send the access token to front end and set the http only cookie for storing refreshToken
//       res.cookie('refreshToken',refreshToken,{
//             httpOnly: true,
//             secure: true,  
//             sameSite: 'None',
//             maxAge: 14 * 24 * 60 * 60 * 1000 // 7 天cor
//           })
//           .status(201)
//           .json({accessToken,id:result.id});

//     }catch(err){
//         console.log(err);
//     }
// });

// const profileMiddleware=(req,res,next)=>{

//  const authHeader=req.headers;
//  const accessToken=authHeader.authorization.split(' ')[1];

// jwt.verify(accessToken,accessTokenKey,(err,decoded)=>{

 
//   if(err){
//     if(err.message=='jwt expired'){
//       return res.json('Expired token').status(401);
//     }
//     console.log('1:',err.message);
//     return res.json('Invalid token').status(401); 
//   }

//   //for send the ID to frontend 
//   req.id=decoded._id;
//   next();
// });

  
// }

// app.use('/profile/:id?', profileMiddleware);

// app.get('/profile/:id',async(req,res)=>{
//   const id = req.params.id;
//   try{
//     const result=await getLogInTasks(id);
   
//     res.json({id:req.id,tasks:result.tasks,taskNum:result.taskNum});
//   }catch(err){
//     console.log(err);
//   }

// });

// app.post('/profile/:id',async(req,res)=>{
//   const id = req.params.id;
//   const lists=req.body;

//   try{
//     const result=await updateTasks(id,lists);
//    if(result>0){
//     res.status(200);
//     return;
//    }
//    res.status(500).send('Server error');
//   }catch(err){
//     console.log(err);
//     res.status(500).send('Server error');
//   }

// });
// app.use('/refreshToken',async(req,res)=>{

//   const refreshToken=req.cookies.refreshToken;
//   if(!refreshToken){
//     console.log('No cookies found');
//     res.json('Invalid or missing authentication token').status(401);
//     return;
//   }
//   jwt.verify(refreshToken,refreshTokenKey,async(err,decoded)=>{
//     if(err){
//       res.json('Invalid or missing authentication token').status(401);
//       return;
//     }
    
//     const accessToken=await generateAccessToken(decoded._id);
//     res.json({accessToken,id:decoded._id}).status(201);
    
  
//   })

// });

// app.get('/profile',(req,res)=>{
  
//   if(req.id){
    
//     res.status(200).json({id:req.id});
//   }
  
// });
// app.listen(8080,()=>{
//     console.log("PORT LISTENING");
// });

module.exports={generateAccessToken,generateRefreshToken};