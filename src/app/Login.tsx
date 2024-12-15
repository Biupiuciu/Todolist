"use client";
import React from "react";
import { useState } from "react";
import Image from "next/image";
import { Button } from "../components/Button";
import { UserAPI } from "../stores/users";
import taskImg from "../asset/Task management system for productivity.png";

export const Login = () => {
  const [userName, setUserName] = useState("");
  const [pwd, setPwd] = useState("");
  const [isForLogin, setIsForLogin] = useState(true);

  const handleClick = async () => {
    try {
      if (isForLogin) {
        await UserAPI.logIn(userName, pwd);
      } else {
        await UserAPI.signUp(userName, pwd);
      }
    } catch (err) {
      console.log(err);
    }
    // const path = isForLogin ? "/api/login" : "/api/signup";
    // try {
    //   const response = await axios.post(path, {
    //     username: userName,
    //     psd: psd,
    //   });
    //   console.log(response.data);
    //   const { accessToken, id } = response.data;
    //   setUserId(id);
    //   localStorage.setItem("accessToken", JSON.stringify(accessToken));
    // } catch (err: any) {
    //   console.log("catched:", err, "?");
    //   if (err.response.data == "Username Duplicate") {
    //     console.log("duplicate");
    //   }
    // }
  };
  const handleUsernameChanged = (e: any) => {
    setUserName(e.currentTarget.value);
  };
  const handlePwdChanged = (e: any) => {
    setPwd(e.currentTarget.value);
  };
  return (
    <div className="background">
      <div className="login">
        <div className="logincontainer">
          <div className="logincontainerLeft">
            <Image src={taskImg} alt="" />
          </div>
          <div className="logincontainerRight">
            <div className="logincontainerTitle">
              {isForLogin ? "Login your account" : "Create your account"}
            </div>
            <div>
              <input
                placeholder="Username"
                type="text"
                value={userName}
                onChange={handleUsernameChanged}
              />
            </div>
            <div>
              <input
                placeholder="Password"
                type="password"
                value={pwd}
                onChange={handlePwdChanged}
              />
            </div>
            <div className="LoginOrSignup">
              <Button
                value={isForLogin ? "Login" : "Signup"}
                clickHandler={handleClick}
                classname="button-width"
              />

              <div
                className="switchLoginOrSignup"
                onClick={() => {
                  setIsForLogin(!isForLogin);
                }}
              >
                <div>
                  {isForLogin ? "Don't have an account?" : "Have an account?"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
