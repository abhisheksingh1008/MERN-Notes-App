"use client";

import React from "react";

const AuthContext = React.createContext({
  isAuthenticated: false,
  userId: null,
  name: null,
  email: null,
  image: null,
  token: null,
  tokenExpirationDate: null,
  prefersGridView: null,
  login: (user) => {},
  signup: (user) => {},
  logout: () => {},
  setListView: () => {},
  setGridView: () => {},
});

export default AuthContext;
