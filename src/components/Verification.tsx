import React from "react";
import { useState } from "react";
import { UserAPI } from "../stores/users";
import { toast } from "sonner";

interface VerifiProps {
  email: string;
  pwd: string;
}
export const Verification = ({ email, pwd }: VerifiProps) => {
  const [code, setCode] = useState("");

  const handleVeriClick = async () => {
    try {
      await UserAPI.verifySignUp(code, email, pwd);
    } catch (err) {
      console.log(err);
      toast.error("internal error");
    }
  };

  const handleCodeChanged = (e: any) => {
    setCode(e.currentTarget.value);
  };
  return (
    <>
      <div className="logincontainerTitle">Email verification required</div>
      <input
        className={`input `}
        placeholder="6 digit verification code"
        type="text"
        value={code}
        onChange={handleCodeChanged}
      />
      <button
        className={`button-login ${code != "" && "button-clickable"}`}
        onClick={handleVeriClick}
      >
        Signup
      </button>
      <div
        className="link"
        onClick={() => {
          UserAPI.resendCode(email);
        }}
      >
        Resend verification code
      </div>
    </>
  );
};
