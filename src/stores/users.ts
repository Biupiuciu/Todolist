import { create } from "zustand";
import { listStore } from "./lists";
import jwt from "jsonwebtoken";
import { message } from "antd";
import { HttpStatus } from "@/utils/httpStatus";
import { Result } from "postcss";

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
  setUser: (newUser: User) => set({ user: newUser }),
  logOutUser: () => {
    set(() => ({ user: {} }));
  },
}));

export class UserAPI {
  static async generateAccessToken() {
    const response = await fetch("api/refresh-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
      body: JSON.stringify({
        email: userStore.getState().user.username,
      }),
    });
    const result = await response.json();

    if (response.status == HttpStatus.OK) {
      return result.accessToken;
    } else {
      message.error(result.message);
      return;
    }
  }

  static async getAuth() {
    // const token = localStorage.getItem("accessToken");
    // try {
    //   if (!token) {
    //     throw new Error("No token stored in LocalStorage");
    //   }
    //   const res = await fetch("/api/profile", {
    //     method: "GET",
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   });
    //   const {id,username} = await res.json();
    //   const { setUser } = userStore.getState();
    //   setUser({id:id,username:username});
    // } catch (err) {
    //   console.log(err);
    // }
  }

  static async signUp(email: string, pwd: string) {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
      body: JSON.stringify({
        email: email,
        psd: pwd,
      }),
    });
    const result = await res.json();
    console.log("test:", result);
    if (res.status == HttpStatus.CREATED) {
      message.success(result.message);
      return true;
    } else {
      message.error(result.message);
      return false;
    }
  }

  static async logIn(email: string, psd: string) {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
      body: JSON.stringify({
        email: email,
        psd: psd,
      }),
    });
    const result = await res.json();

    if (res.status == HttpStatus.OK) {
      message.success(result.message);
      userStore.getState().setUser({ username: email });
    } else {
      message.error(result.message);
    }
    // const data=await res.json();
    // console.log("LOGINDATA:",data);

    // const { accessToken} = data;

    // localStorage.setItem("accessToken", JSON.stringify(accessToken.value));
    // this.getAuth();
  }
  static async verifySignUp(code: string, email: string, pwd: string) {
    const res = await fetch("/api/verifysignup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        code: code,
        pwd: pwd,
      }),
    });
    const result = await res.json();

    if (res.status == HttpStatus.CREATED) {
      console.log("run???");
      await UserAPI.logIn(email, pwd);
      //if fail???
    } else {
      //handle db creation fail
      message.error(result.message);
    }
  }

  static async resendCode(email: string) {
    const res = await fetch("/api/resendcode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    });
    const result = await res.json();
    if (res.status == HttpStatus.OK) {
      message.success(result);
    } else {
      message.error(result.message);
    }
  }
  static logOut() {
    userStore.getState().logOutUser();
    listStore.getState().resetLists();

    localStorage.removeItem("accessToken");
  }
}
