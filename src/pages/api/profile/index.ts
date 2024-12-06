import { runMiddleware, profileMiddleware } from "./[id]";
import type { NextApiHandler} from 'next'
const index:NextApiHandler = async (req, res) => {
  await runMiddleware(req, res, profileMiddleware);
  if (req.id) {
    res.status(200).json({ id: req.id });
  }
};

export default index;
