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

const DEFAULT_LIST=[
    { tasks: [], title: "To do" },
    { tasks: [], title: "In progress" },
    { tasks: [], title: "Done" },
  ] as Array<List>

export const listStore = create<{
    lists:Array<List>;
    resetLists:()=>void
}>((set) => ({
    lists: DEFAULT_LIST,
    resetLists:()=>set(()=>({lists:DEFAULT_LIST}))
  }));

  export class ListAPI{

  }