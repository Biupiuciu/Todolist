import { createContext } from "react";

export type ListType = "todo" | "inpro" | "done";

interface MyContextType {
  firstTimeFocused: boolean;
  setFirstTimeFocused: (value: boolean) => void;
  menuPosition: { x: number; y: number };
  setMenuPosition: (value: { x: number; y: number }) => void;
  showMenu: [number, number];
  setShowMenu: (value: [number, number]) => void;
  isEditting: boolean;
  setIsEditting: (value: boolean) => void;
  editId: number|undefined;
  setEditId: (value: number) => void;
  isHomePage:boolean;
  setIsHomePage: (value: boolean) => void;
}

export const MyContext = createContext<MyContextType>({
 
  firstTimeFocused: false,
  setFirstTimeFocused: (object: boolean) => {object;},
  menuPosition: { x: 0, y: 0 },
  setMenuPosition: (object: any) => {object ;},

  //first digit:-1 -- unvisible >-1 -- show which task's menu
  //second digit:which list
  showMenu: [-1, -1],
  setShowMenu: (int: number[]) => {int ;},
  isEditting: false,
  setIsEditting: (boolean: boolean) => {boolean;},
  editId: -1,
  setEditId: (id: number) => {id ;},
  isHomePage:true,
  setIsHomePage: (boolean: boolean) => {boolean;},
});
