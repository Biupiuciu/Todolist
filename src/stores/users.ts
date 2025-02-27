import { create } from "zustand";
import { listStore } from "./lists";
import { toast } from "sonner";
import { HttpStatus } from "@/utils/httpStatus";
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
    console.log("calling....");
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
      toast.error(result.message);
      return;
    }
  }

  static async getAuth() {
    try {
      console.log("call getAuth,");
      const res = await fetch("/api/profile", {
        method: "GET",
      });
      const result = await res.json();
      console.log("?", result);
      const { id, username } = result;
      console.log("after run /profile,", id, username);
      const { setUser } = userStore.getState();
      setUser({ id: id, username: username });
      return id;
    } catch (err) {
      console.log(err);
      UserAPI.logOut();
    }
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
      toast.success(result.message);

      return true;
    } else {
      toast.error(result.message);
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
      toast.success(result.message);
      console.log("after login,", result.username); //debug
      userStore.getState().setUser({ username: email });
    } else {
      toast.error(result.message);
    }
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
      toast.error(result.message);
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
      toast.success(result);
    } else {
      toast.error(result.message);
    }
  }
  static async logOut() {
    userStore.getState().logOutUser();
    listStore.getState().resetLists();

    await fetch("/api/logout", { method: "POST" });
  }
}
