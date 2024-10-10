
require('dotenv').config();
const db_host=process.env.DB_HOST;
const db_user=process.env.DB_USER;
const db_pwd=process.env.DB_PWD;
const db_name=process.env.DB_DBNAME;
const mysql=require('mysql2');

const pool=mysql.createPool({
    host:db_host,
    user:db_user,
    password:db_pwd,
    database:db_name,
    port: 3306,    
}).promise();

const getLogInTasks=async(id)=>{
    
    try{
        // const [rows] = await pool.query('SELECT 1');
        // console.log('连接成功:', rows);
        const [rows] = await pool.query('select tasks,taskNum from users where id='+id);
        console.log(rows);
        console.log('test');
        if(rows[0]){
            
            return {tasks:rows[0].tasks,taskNum:rows[0].taskNum};
        }
        return ;
        
       
    }catch(err){
        console.log(err);
    }
}
const updateTasks=async(id,{todoList,addNewTask})=>{
    const newTasks=JSON.stringify(todoList);
    try{
        const queryRequest=addNewTask?`UPDATE users SET taskNum=taskNum+1,tasks ='${newTasks} ' WHERE id = '${id}'`:`UPDATE users SET tasks ='${newTasks} ' WHERE id = '${id}'`;
        const [rows] = await pool.query(queryRequest);
        
            return rows.affectedRows;
       
    }catch(err){
        console.log(err);
    }
}

const getLoginInfo=async(Name)=>{
    try{

        const [rows] = await pool.query(`SELECT * FROM users WHERE username = '${Name}'`);
        if(rows[0]){
            return {id:rows[0].id,username:rows[0].username,pwd:rows[0].pwd};
        }
        return ;
    }catch(err){
        console.log(err);
    }
}
const createUser=async(Name,pwd)=>{
    try{
        console.log('database-signup');
        console.log(`INSERT INTO users (username, pwd, tasks,taskNum) 
        VALUES ('${Name}', '${pwd}', '[{"tasks": [ {"id": "0", "content": "Task1"}], "title": "To do"}, {"tasks": [], "title": "In progress"}, {"tasks": [], "title": "Done"}]',1);`);

        const [rows]=await pool.query(`INSERT INTO users (username, pwd, tasks,taskNum) 
        VALUES ('${Name}', '${pwd}', '[{"tasks": [ {"id": "0", "content": "Task1"}], "title": "To do"}, {"tasks": [], "title": "In progress"}, {"tasks": [], "title": "Done"}]',1);`);
    
       
            return rows.insertId;
        
}catch(err){
    return err.code;
}
}
module.exports={getLogInTasks,getLoginInfo,updateTasks,createUser};