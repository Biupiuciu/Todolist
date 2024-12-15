"use client";
import React, { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import { Login } from "./Login";
import { Tasks } from "./Tasks";
import { UserAPI } from "../stores/users";
import { userStore } from "../stores/users";

export const Todo = () => {
  const userId = userStore((state) => state.user.id);

  const { showMenu, setShowMenu } = useContext(MyContext);

  useEffect(() => {
    const handleDocumentClick = () => {
      if (showMenu[0] > -1) {
        console.log("!!");
        setShowMenu([-1, showMenu[1]]);
      }
    };

    const handleResize = () => {
      setShowMenu([-1, showMenu[1]]);
    };
    document.addEventListener("click", handleDocumentClick);
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
      window.removeEventListener("resize", handleResize);
    };
  }, [showMenu]);

  useEffect(() => {
    const testAuth = async () => {
      await UserAPI.getAuth();
    };
    testAuth();
  }, []);

  return <>{userId ? <Tasks /> : <Login></Login>}</>;
};
