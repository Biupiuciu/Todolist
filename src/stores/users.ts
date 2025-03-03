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
      const savedUsername = localStorage.getItem("username");
      if (!savedUsername) throw new Error("No login info");
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ savedUsername: savedUsername }),
      });
      const result = await res.json();

      if (res.status == HttpStatus.OK) {
        console.log("user getAuth: ", result);
        const { id, username } = result;
        const { setUser } = userStore.getState();
        setUser({ id: id, username: username });
        return id;
      } else {
        throw new Error(result.message);
      }
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
      localStorage.setItem("username", email);
      toast.success(result.message);
      userStore.getState().setUser({ username: email });
      return false;
    } else {
      toast.error(result.message);
      if (result.userNotConfirmed) {
        return true;
      }
      return false;
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
      await UserAPI.logIn(email, pwd);
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
      toast.success("Resend verification code.");
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
