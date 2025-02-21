import { pool } from "../database";

export default async function getUserId(username: string) {
  const { rows } = await pool.query(`SELECT id from users WHERE username=$1`, [
    username,
  ]);

  if (rows.length != 1) {
    return;
  }
  return rows[0].id;
}
