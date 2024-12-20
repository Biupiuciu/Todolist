import React from "react";
import "./app.scss";
import Link from "next/link";
export const Home = () => {
  return (
    <div className="homepage">
      <div className="center-content">
        <div className="logo-container">
          <div className="logo-shadow"></div>

          <Link href="/">
            <div className="flip_wrap ">
              <div className="flip">
                <div className="side front">
                  <div className="logo-text2">
                    Get It <br />
                    <span className="font-color">Done</span>
                  </div>
                </div>
                <div className="side back">
                  <div className="logo-text1">Log in &gt;</div>
                </div>
              </div>
            </div>
          </Link>
        </div>
        <div className="text-center">
          Stay organized and conquer your tasks with <br />
          GetItDone – your ultimate productivity partner!
        </div>
      </div>
    </div>
  );
};
