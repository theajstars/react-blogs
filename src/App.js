import Cookies from "js-cookie";
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import "./Assets/CSS/All.css";
import Auth from "./Components/Auth";
import Feed from "./Components/Auth/Feed";

export default function App() {
  const [token, setToken] = useState(Cookies.get("ud"));
  if (token) {
  } else {
  }
  return <></>;
}
