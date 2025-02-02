"use client";
import React from "react";
import { useState } from "react";
import { UserAPI } from "../stores/users";
import logo from "../asset/logo.png";
import Link from "next/link";
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
  };
  const handleUsernameChanged = (e: any) => {
    setUserName(e.currentTarget.value);
  };
  const handlePwdChanged = (e: any) => {
    setPwd(e.currentTarget.value);
  };
  return (
    <div className="background">
      <Link href="/ ">
        <img src={logo.src} className="logo" />
      </Link>

      <div className="center-content">
        <div className="logincontainerTitle">
          {isForLogin ? "Login your account" : "Create your account"}{" "}
        </div>

        <input
          className="input"
          placeholder="Username"
          type="text"
          value={userName}
          onChange={handleUsernameChanged}
        />

        <input
          className="input"
          placeholder="Password"
          type="password"
          value={pwd}
          onChange={handlePwdChanged}
        />
        <div className="button-login" onClick={handleClick}>
          {isForLogin ? "Login" : "Signup"}
        </div>
        <div
          className="switchLoginOrSignup"
          onClick={() => {
            setIsForLogin(!isForLogin);
          }}
        >
          {isForLogin ? "Don't have an account?" : "Have an account?"}
        </div>
      </div>
    </div>
  );
};
