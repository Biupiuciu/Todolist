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
    setUserId:(int:number) => {},
    taskNum:0,
    setTaskNum:(int:any) => {},
    lists: [
        { title: '', tasks: [{content:'',id:''}] },
        { title: '', tasks: [{content:'',id:''}] },
        { title: '', tasks: [{content:'',id:''}] }
        ],
    setLists: (object:any) =>{},
    firstTimeFocused:false,
    setFirstTimeFocused:(object:boolean) => {},
    menuPosition:{x:0,y:0},
    setMenuPosition:(object:any)=>{},
   
    //first digit:-1 -- unvisible >-1 -- show which task's menu
    //second digit:which list
    showMenu:[-1,-1],
    setShowMenu:(int:number[])=>{},
    isEditting: false,
    setIsEditting: (boolean:boolean) => {},
    editId: '',
    setEditId: (string:string) => {},
    

});