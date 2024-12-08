import {create} from 'zustand';

type ListTitle = "To do" | "In progress" | "Done";
export interface Task{
id?:number,
content?:string
}
export interface List{
    tasks:Array<Task>,
    title:ListTitle
}

export const listStore = create(() => ({
    lists: Array<List>,
  }));

  export class ListAPI{

  }