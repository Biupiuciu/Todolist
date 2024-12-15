import { create } from "zustand";
import { listStore } from "./lists";
import jwt from "jsonwebtoken";
const accessTokenKey = process.env.ACCESS_TOKEN_PRIVATE_KEY;
export interface User {
  id?: number;
  username?: string;
}

export const userStore = create<{
  user: User;
  setUser: (user: User) => void;
  logOutUser: () => void;
}>((set) => ({
  user: {},
  setUser: (newUser: User) => set( {user: newUser} ),
  logOutUser: () => {
    set(() => ({ user: {} }));
  },
}));

export class UserAPI {

  static async generateAccessToken(id:string){
    const payload = { _id: id };

    if(!accessTokenKey) { throw new Error("Access Token Key is not defined");}

    const accessToken = jwt.sign(payload, accessTokenKey, { expiresIn: "1d" });
    console.log('TOKEN ',accessToken);
    // const now = new Date();
    // const currentTime=now.getTime()+14 * 60 * 1000;
    // const currentTime = now.getTime() + 60 * 1000;
    // return { value: accessToken, expiry: currentTime };

    return { value: accessToken };
  }

  static async getAuth() {
    const token = localStorage.getItem("accessToken");
    try {
      if (!token) {
        throw new Error("No token stored in LocalStorage");
      }

      const res = await fetch("/api/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const {id,username} = await res.json();
     
      const { setUser } = userStore.getState();
      setUser({id:id,username:username});
      
      
    } catch (err) {
      console.log(err);
    }
  }

  static async signUp(username: string, pwd: string) {
    console.log("signup ",pwd);
    try{
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
        body: JSON.stringify({
          username: username,
          psd: pwd
        }),
      });

      const {accessToken}=await res.json();
      console.log("SIGNUP DATA:",accessToken.value);

      localStorage.setItem("accessToken", JSON.stringify(accessToken.value));
      this.getAuth();

    }catch(err){
      console.log(err);
    }
  }

  static async logIn(username: string, pwd: string) {
    console.log("???",pwd);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
        body: JSON.stringify({
          username: username,
          psd: pwd
        }),
      });

      const data=await res.json();
      console.log("LOGINDATA:",data);

      const { accessToken} = data;

      localStorage.setItem("accessToken", JSON.stringify(accessToken.value));
      this.getAuth();
    } catch (err) {
      throw new Error(err as string);
    }
  }

  static logOut() {
    userStore.getState().logOutUser();
    listStore.getState().resetLists();

    localStorage.removeItem("accessToken");
  }
}
