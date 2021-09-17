import Cookies from "js-cookie";
import React from "react";
function LogoutUser() {
  Cookies.remove("ud");
  window.location.href = "/auth";
}
function Logout() {
  return (
    <div className="logout-container">
      <button className="button-dark text-light" onClick={() => LogoutUser()}>
        <i className="far fa-sign-out-alt"></i> Logout
      </button>
    </div>
  );
}

export default Logout;
