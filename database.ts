import "dotenv/config";
import { Pool } from "pg";
import { neon } from "@neondatabase/serverless";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const getLogInTasks = async (id) => {
  try {
    // const [rows] = await pool.query('SELECT 1');
    // console.log('连接成功:', rows);
    const [rows] = await pool.query(
      "select tasks,taskNum from users where id=" + id,
    );
    console.log(rows);
    console.log("test");
    if (rows[0]) {
      return { tasks: rows[0].tasks, taskNum: rows[0].taskNum };
    }
    return;
  } catch (err) {
    console.log(err);
  }
};
export const updateTasks = async (id, { todoList, addNewTask }) => {
  const newTasks = JSON.stringify(todoList);
  try {
    const queryRequest = addNewTask
      ? `UPDATE users SET taskNum=taskNum+1,tasks ='${newTasks} ' WHERE id = '${id}'`
      : `UPDATE users SET tasks ='${newTasks} ' WHERE id = '${id}'`;
    const [rows] = await pool.query(queryRequest);

    return rows.affectedRows;
  } catch (err) {
    console.log(err);
  }
};

export const getLoginInfo = async (Name) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM users WHERE username = '${Name}'`,
    );
    if (rows[0]) {
      return { id: rows[0].id, username: rows[0].username, pwd: rows[0].pwd };
    }
    return;
  } catch (err) {
    console.log(err);
  }
};
export const createUser = async (Name: string, pwd: string) => {
  try {
    const result =
      await pool.query(`INSERT INTO users (username, pwd, tasks,taskNum) 
        VALUES ('${Name}', '${pwd}', '[{"tasks": [ {"id": "0", "content": "Task1"}], "title": "To do"}, {"tasks": [], "title": "In progress"}, {"tasks": [], "title": "Done"}]',1) RETURNING id;;`);

        const {rowCount}=result;
  
    if(rowCount!=1){
        throw new Error();
    }

    return result.rows[0].id;
  } catch (err) {
    return err.code;
  }
};

export const checkDuplicateUserName = async (username: string) => {
  const { rows } = await pool.query(
    `SELECT * FROM users WHERE username = '${username}'`,
  );

  if (rows.length > 0) {
    return false;
  }
  return true;
};
