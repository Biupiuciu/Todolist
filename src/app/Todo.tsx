"use client";
import React, { useContext, useEffect } from "react";
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

export const VerifyAccessToken = (data: any) => {
  if (data.id) {
    return data.id;
  }

  return 0;
};
export const RefreshAccessToken = async () => {
  try {
    const response = await axios.post("/api/refreshToken", {});

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

      const { data } = await axios.get("/api/profile", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const id = VerifyAccessToken(data);
      setUserId(id);
    } catch (err) {
      const error = err as Error;
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;

        if (data == "Expired token") {
          const id = await RefreshAccessToken();
          setUserId(id);
        }
        if (data == "Invalid token") {
          localStorage.removeItem("accessToken");
        }
      }
    }
  };

  useEffect(() => {
    isLogIn();
  }, []);

  return <>{userId > 0 ? <Tasks /> : <Login></Login>}</>;
};
