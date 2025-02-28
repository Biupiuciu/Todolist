"use client";
import React from "react";
import { useState } from "react";
import { UserAPI } from "../stores/users";
import logo from "../asset/logo.png";
import Link from "next/link";
import { isValidEmail, isValidPassword } from "../utils/validation";
import { Verification } from "./Verification";
import { toast } from "sonner";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [isForLogin, setIsForLogin] = useState(true);
  const [isEmailValidated, setIsEmailValidated] = useState(false);
  const [isPasswordValidated, setIsPasswordValidated] = useState(false);
  const [emailWarning, setEmailWarning] = useState(false);
  const [passwordWarning, setPasswordWarning] = useState(false);
  const [stepVerification, setStepVerification] = useState(false);
  const handleClick = async () => {
    if (!isEmailValidated || !isPasswordValidated) {
      setEmailWarning(!isValidEmail(email, isForLogin));
      setPasswordWarning(!isValidPassword(pwd, isForLogin));
      return;
    }
    try {
      if (isForLogin) {
        const result = await UserAPI.logIn(email, pwd);

        //account not verified
        if (result) {
          await UserAPI.resendCode(email);
          setStepVerification(result);
        }
      } else {
        const result = await UserAPI.signUp(email, pwd);
        setStepVerification(result ?? false);
      }
    } catch (err) {
      console.log(err);
      toast.error("internal error");
    }
  };

  const handleEmailChanged = (e: any) => {
    setIsEmailValidated(isValidEmail(e.currentTarget.value, isForLogin));
    setEmailWarning(!isValidEmail(e.currentTarget.value, isForLogin));
    setEmail(e.currentTarget.value);
  };
  const handlePwdChanged = (e: any) => {
    setIsPasswordValidated(isValidPassword(e.currentTarget.value, isForLogin));
    setPasswordWarning(!isValidPassword(e.currentTarget.value, isForLogin));
    setPwd(e.currentTarget.value);
  };

  return (
    <div className="background">
      <Link href="/ ">
        <img src={logo.src} className="logo" />
      </Link>

      <div className="center-content">
        {stepVerification ? (
          <Verification email={email} pwd={pwd} />
        ) : (
          <>
            <div className="logincontainerTitle">
              {isForLogin ? "Login your account" : "Create your account"}{" "}
            </div>

            <input
              className={`input ${emailWarning && "input-warning"}`}
              placeholder={`Email ${isForLogin ? "" : "(name@host.com)"}`}
              type="text"
              value={email}
              onChange={handleEmailChanged}
            />

            <input
              className={`input ${passwordWarning && "input-warning"}`}
              placeholder={`Password ${
                isForLogin ? "" : "(at least 8 digits)"
              }`}
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
              className="link"
              onClick={() => {
                setIsForLogin(!isForLogin);
                setEmailWarning(!isValidEmail(email, !isForLogin));
                setIsEmailValidated(isValidEmail(email, !isForLogin));
                setPasswordWarning(!isValidPassword(pwd, !isForLogin));
                setIsPasswordValidated(isValidPassword(pwd, !isForLogin));
              }}
            >
              {isForLogin ? "Don't have an account?" : "Have an account?"}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
