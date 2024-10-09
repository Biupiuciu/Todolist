"use client";
import React, { useContext } from "react";
import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { MyContext } from "./MyContext";
import taskImg from "../asset/Task management system for productivity.png";
export const Login = () => {
  const [userName, useUserName] = useState("");
  const [psd, usePsd] = useState("");
  const [isForLogin, setIsForLogin] = useState(true);
  const { setUserId } = useContext(MyContext);

  const handleLogin = async () => {
    const path = isForLogin ? "/api/login" : "/api/signup";
    try {
      const response = await axios.post(path, {
        username: userName,
        psd: psd,
      });

      if (response.data == "Username Duplicate") {
        console.log("duplicate");
      }
      const { accessToken, id } = response.data;
      setUserId(id);
      localStorage.setItem("accessToken", JSON.stringify(accessToken));
    } catch (err) {
      console.log(err);
    }
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
                onChange={(e) => {
                  useUserName(e.currentTarget.value);
                }}
              />
            </div>
            <div>
              <input
                placeholder="Password"
                type="password"
                value={psd}
                onChange={(e) => {
                  usePsd(e.currentTarget.value);
                }}
              />
            </div>
            <div className="LoginOrSignup">
              <button className="button-4  button-width" onClick={handleLogin}>
                {isForLogin ? "Login" : "Signup"}
              </button>
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
