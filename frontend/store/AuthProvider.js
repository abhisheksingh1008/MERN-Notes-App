"use client";

import React, { useState, useEffect } from "react";
import AuthContext from "./auth-context";

let userInfo = null;

if (typeof window !== "undefined") {
  userInfo = JSON.parse(localStorage.getItem("user"));

  if (userInfo) {
    const tokenExpirationDate = userInfo?.tokenExpirationDate;
    const currentDate = new Date(Date.now()).toISOString();

    if (currentDate > tokenExpirationDate) {
      localStorage.removeItem("user");
      user = null;
    }
  }
}

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(userInfo);

  const loginHandler = (user) => {
    const { userId, name, email, token } = user;

    if (!userId || !email || !token) {
      return;
    }

    const tokenExpirationDate = new Date(
      new Date().getTime() + 7 * 24 * 60 * 60 * 1000
    );

    const userInfo = {
      isAuthenticated: true,
      userId,
      name,
      email,
      token,
      image: user?.image,
      prefersGridView: user?.prefersGridView,
      tokenExpirationDate: tokenExpirationDate.toISOString(),
    };

    localStorage.setItem("user", JSON.stringify(userInfo));

    setUser({ ...userInfo });
  };

  const signupHandler = (user) => {
    const { userId, name, email, token } = user;

    if (!userId || !email || !token) {
      return;
    }

    const tokenExpirationDate = new Date(
      new Date().getTime() + 7 * 24 * 60 * 60 * 1000
    );

    const userInfo = {
      isAuthenticated: true,
      userId,
      name,
      email,
      token,
      image: user?.image,
      prefersGridView: user?.prefersGridView,
      tokenExpirationDate: tokenExpirationDate.toISOString(),
    };

    localStorage.setItem("user", JSON.stringify(userInfo));

    setUser({ ...userInfo });
  };

  const logoutHandler = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const gridViewHandler = (isGridView) => {
    setUser((prev) => {
      return {
        ...prev,
        prefersGridView: isGridView,
      };
    });

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, prefersGridView: isGridView })
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signup: signupHandler,
        login: loginHandler,
        logout: logoutHandler,
        setGridView: gridViewHandler,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
