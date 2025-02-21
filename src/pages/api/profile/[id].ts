import { pool } from "../../../lib/database";
import { HttpStatus } from "@/utils/httpStatus";
import type { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  if (req.method == "GET") {
    const { id } = req.query;

    const { rows } = await pool.query(
      `SELECT tasks,tasknum from users WHERE id=${id}`
    );

    if (rows.length != 1) {
      throw new Error("Can't find tasks");
    }

    return res
      .status(HttpStatus.OK)
      .json({ lists: rows[0].tasks, taskNum: rows[0].tasknum });
  } else if (req.method == "PUT") {
    const { id } = req.query;

    const { todoList, addNewTask } = req.body;
    const formatedList = JSON.stringify(todoList);

    const queryRequest = addNewTask
      ? `UPDATE users SET taskNum=taskNum+1,tasks ='${formatedList} ' WHERE id = '${id}'`
      : `UPDATE users SET tasks ='${formatedList} ' WHERE id = '${id}'`;
    const result = await pool.query(queryRequest);

    if (result.rowCount != 1) {
      return res.status(400).json("failed");
    }

    return res.status(200).json("succeed");
  }
};

export default handler;
