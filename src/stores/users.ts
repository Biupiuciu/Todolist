import {create} from 'zustand';


export interface User{
  id?:number,
  username?:string,
}

export const userStore = create(() => ({
    user:{} 
  }));

  export class ListAPI{
    
  }