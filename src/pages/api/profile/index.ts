import { runMiddleware, profileMiddleware } from "./[id]";
import type { NextApiHandler} from 'next';
const index:NextApiHandler = async (req, res) => {
  await runMiddleware(req, res, profileMiddleware);
  const { id } = req.body;
  if (id) {
    res.status(200).json({ id: id });
  }
};

export default index;
