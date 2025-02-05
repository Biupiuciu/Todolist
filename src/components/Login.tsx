"use client";
import React from "react";
import { useState } from "react";
import { UserAPI } from "../stores/users";
import logo from "../asset/logo.png";
import Link from "next/link";
import { isValidEmail, isValidPassword } from "../utils/validation";
export const Login = () => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [isForLogin, setIsForLogin] = useState(true);
  const [isEmailValidated, setIsEmailValidated] = useState(false);
  const [isPasswordValidated, setIsPasswordValidated] = useState(false);
  const [emailWarning, setEmailWarning] = useState(false);
  const [passwordWarning, setPasswordWarning] = useState(false);
  const handleClick = async () => {
    if (!isEmailValidated || !isPasswordValidated) {
      console.log(pwd);
      console.log(!isValidPassword(pwd));
      setEmailWarning(!isValidEmail(email));
      setPasswordWarning(!isValidPassword(pwd));
      return;
    }
    try {
      if (isForLogin) {
        await UserAPI.logIn(email, pwd);
      } else {
        await UserAPI.signUp(email, pwd);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleEmailChanged = (e: any) => {
    setIsEmailValidated(isValidEmail(e.currentTarget.value));
    setEmailWarning(!isValidEmail(e.currentTarget.value));
    console.log(!isValidEmail(e.currentTarget.value));
    setEmail(e.currentTarget.value);
  };
  const handlePwdChanged = (e: any) => {
    setIsPasswordValidated(isValidPassword(e.currentTarget.value));
    setPasswordWarning(!isValidPassword(e.currentTarget.value));
    console.log(e.currentTarget.value);
    console.log(!isValidPassword(e.currentTarget.value));
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
          className={`input ${emailWarning && "input-warning"}`}
          placeholder="Email"
          type="text"
          value={email}
          onChange={handleEmailChanged}
        />

        <input
          className={`input ${passwordWarning && "input-warning"}`}
          placeholder="Password"
          type="password"
          value={pwd}
          onChange={handlePwdChanged}
        />
        <button
          className={`button-login ${
            isEmailValidated && isPasswordValidated && "button-clickable"
          }`}
          onClick={handleClick}
        >
          {isForLogin ? "Login" : "Signup"}
        </button>
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
