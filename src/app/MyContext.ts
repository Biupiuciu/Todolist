
import { createContext } from 'react';


export interface Task{
    content: string;id: string;
}

export interface Tasks{
    title: "To do"|"In progress"|"Done",
    tasks: Task[]|null;
}
export type ToDoList=Tasks[];

export type ListType = "todo" | "inpro" | "done";
export const MyContext = createContext({
    userId:0,
    setUserId:(int:number) => {int},
    taskNum:0,
    setTaskNum:(int:number) => {int},
    lists: [
        { title: '', tasks: [{content:'',id:''}] },
        { title: '', tasks: [{content:'',id:''}] },
        { title: '', tasks: [{content:'',id:''}] }
        ],
    setLists: (object:any) =>{object},
    firstTimeFocused:false,
    setFirstTimeFocused:(object:boolean) => {object},
    menuPosition:{x:0,y:0},
    setMenuPosition:(object:any)=>{object},
   
    //first digit:-1 -- unvisible >-1 -- show which task's menu
    //second digit:which list
    showMenu:[-1,-1],
    setShowMenu:(int:number[])=>{int},
    isEditting: false,
    setIsEditting: (boolean:boolean) => {boolean},
    editId: '',
    setEditId: (string:string) => {string},
    

});