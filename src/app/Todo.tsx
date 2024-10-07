"use client";
import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext";
import { Login } from "./Login";
import axios from "axios";
import { Tasks } from "./Tasks";

export const GetAccessToken = () => {
  let accessToken;
  try {
    accessToken = JSON.parse(localStorage.getItem("accessToken") || "");
    if (!accessToken) {
      throw new Error("No token stored in LocalStorage");
    }
    return accessToken.value;
  } catch (err) {
    console.log(err);
  }
};

export const VerifyAccessToken = async (data: any) => {
  if (data.id) {
    return data.id;
  }
  if (data == "Expired token") {
    return RefreshAccessToken();
  }
  if (data == "Invalid token") {
    localStorage.removeItem("accessToken");
    return 0;
  }
  return 0;
};
export const RefreshAccessToken = async () => {
  try {
    const response = await axios.post("/refreshToken", {});

    if (response.status == 401) {
      localStorage.removeItem("accessToken");
      return 0;
    }
    const { accessToken, id } = response.data;

    localStorage.setItem("accessToken", JSON.stringify(accessToken));
    return id;
  } catch (err) {
    console.log(err);
    return 0;
  }
};
export const Todo = () => {
  const { userId, setUserId, showMenu, setShowMenu } = useContext(MyContext);

  useEffect(() => {
    const handleDocumentClick = () => {
      if (showMenu[0] > -1) {
        console.log("!!");
        setShowMenu([-1, showMenu[1]]);
      }
    };
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [showMenu]);

  const isLogIn = async () => {
    try {
      const accessToken = GetAccessToken();

      const { data } = await axios.get("/profile", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const id = await VerifyAccessToken(data);

      setUserId(id);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    isLogIn();
  }, []);

  return <>{userId > 0 ? <Tasks /> : <Login></Login>}</>;
};
