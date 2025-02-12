"use client";
import React, { useContext, useEffect } from "react";
import { MyContext } from "../../context/MyContext";
import "../../app/app.scss";
import { Login } from "../../components/Login";
import { Tasks } from "../../components/Tasks";
import { UserAPI } from "../../stores/users";
import { userStore } from "../../stores/users";

const Todo = () => {
  const username = userStore((state) => state.user.username);

  const { showMenu, setShowMenu } = useContext(MyContext);

  useEffect(() => {
    console.log("showMenu is changing..");
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

  return (
    <>
      {username ? <Tasks /> : <Login></Login>}{" "}
      <div className="footer">
        Stay organized and conquer your tasks with GetItDone – your ultimate
        productivity partner!
      </div>
    </>
  );
};

export default Todo;
