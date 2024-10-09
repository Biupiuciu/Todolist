
import {runMiddleware, profileMiddleware } from './[id]'
const index = async(req,res) => {
    await runMiddleware(req, res, profileMiddleware);
    if(req.id){
    
        res.status(200).json({id:req.id});
      }
      
}

export default index;