import React from "react";
import { Link } from "react-router-dom";
import "../../Assets/CSS/Profile.css";
import "../../Assets/CSS/Feed.css";
export default function HomeIcon() {
  return (
    <Link to="/feed" className="nav-link text-dark bg-light">
      <i className="fas fa-home-alt"></i>
    </Link>
  );
}
