import React from "react";
import { Link } from "react-router-dom";
import "../../Assets/CSS/Profile.css";
import "../../Assets/CSS/Feed.css";
export default function ProfileIcon() {
  return (
    <Link to="/profile" className="nav-link text-dark bg-light">
      A
    </Link>
  );
}
