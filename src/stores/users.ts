import {create} from 'zustand';
import {listStore} from './lists'

export interface User{
  id?:number,
  username?:string,
}

export const userStore = create<{
  user:User;
  setUser:(user: User) => void;
  logOutUser:()=>void
  }>((set) => ({
    user:{} ,
    setUser:(newUser:User)=>set(()=>({user:newUser})),
    logOutUser:()=>{set(()=>({user:{}}))}
  }));

 

  export class UserAPI{
    static getAuth(){}

    static signUp(){}
    static logIn(){}
    static getUser(){}

    static logOut(){
      userStore.getState().logOutUser();
      listStore.getState().resetLists();
     
      localStorage.removeItem("accessToken");
    }
  }