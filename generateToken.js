const { Pause } = require("@mui/icons-material");
const jwt=require("jsonwebtoken");

const generateToken=async(user)=>{
    const payload={_id:user.id};
    const accessToken=jwt.sign(payload,process.env.ACCESS_TOKEN_PRIVATE_KEY,{expiresIn:'14m'});
    const refreshToken=jwt.sign(payload,process.env.REFRESH_TOKEN_PRIVATE_KEY,{expiresIn:'14d'});
}