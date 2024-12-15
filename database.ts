import "dotenv/config";
import { Pool } from "pg";
import { neon } from "@neondatabase/serverless";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});


export const updateTasks = async (
  id: string | number,
  { todoList, addNewTask }: any,
) => {
  //any for now
  const newTasks = JSON.stringify(todoList);
  try {
    const queryRequest = addNewTask
      ? `UPDATE users SET taskNum=taskNum+1,tasks ='${newTasks} ' WHERE id = '${id}'`
      : `UPDATE users SET tasks ='${newTasks} ' WHERE id = '${id}'`;
    const res = await pool.query(queryRequest);

    return res.rowCount;
  } catch (err) {
    console.log(err);
  }
};




