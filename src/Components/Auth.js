import { Checkbox, Typography } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import axios from "axios";

import "../Assets/CSS/Auth.css";
import Cookies from "js-cookie";
function Auth() {
  const [loginStatus, setLoginStatus] = useState(false);
  const [isLoginVisible, setLoginVisibility] = useState(true);
  const [smallLoginDisplay, setSmallLoginDisplay] = useState(false);
  const [smallRegisterDisplay, setSmallRegisterDisplay] = useState(true);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [isRemember, setRememberMe] = useState(true);
  const [isTermsAccepted, setTermsAccepted] = useState(true);

  const [errorDisplay, setErrorDisplay] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = Cookies.get("ud");
    if (token !== undefined) {
      window.location.href = "/feed";
    }
  }, []);
  //   Login status state change
  useEffect(() => {
    console.log("Login status: ", loginStatus);
    if (loginStatus) {
      window.location.href = "/feed";
    }
  }, [loginStatus]);
  function loginUser(e) {
    e.preventDefault();
    if (username.length === 0 || password.length === 0) {
      setErrorDisplay(true);
      setErrorMessage("There are errors in your form!");
      setTimeout(() => {
        setErrorDisplay(false);
      }, 3000);
    } else {
      axios
        .post("http://localhost:8080/login", {
          username: username,
          password: password,
        })
        .then((res) => {
          console.log(res);
          if (res.data.userFound === false) {
            //   User does not exist
            setErrorDisplay(true);
            setErrorMessage("User does not exist!");
            setTimeout(() => setErrorDisplay(false), 2500);
          } else {
            // User Exists
            if (res.data.auth) {
              Cookies.set("ud", res.data.token, { expires: 4 });
              setLoginStatus(true);
              axios
                .get("http://localhost:8080/isUserAuth", {
                  headers: {
                    "x-access-token": res.data.token,
                  },
                })
                .then((res) => {
                  console.log(res);
                });
            } else {
              setLoginStatus(false);
              setErrorDisplay(true);
              setErrorMessage("Invalid password!");
              setTimeout(() => setErrorDisplay(false), 2500);
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }
  function registerUser(e) {
    e.preventDefault();
    if (
      name.length === 0 ||
      username.length === 0 ||
      email.length === 0 ||
      password.length === 0 ||
      password !== password2 ||
      !isTermsAccepted
    ) {
      setErrorDisplay(true);
      setErrorMessage("There are errors in your form!");
      setTimeout(() => {
        setErrorDisplay(false);
      }, 3000);
    } else {
      const userObject = {
        name: name,
        password: password,
        username: username,
        email: email,
      };
      axios
        .post("http://localhost:8080/register", userObject)
        .then((res) => {
          console.log(res);
          if (res.data.userFound) {
            // User already exists
            setErrorDisplay(true);
            setErrorMessage("Username or Email is taken!");
            setTimeout(() => {
              setErrorDisplay(false);
            }, 3000);
          }
          if (res.data.auth) {
            setLoginStatus(true);
            Cookies.set("ud", res.data.token, { expires: 4 });
          } else {
            setLoginStatus(false);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  function showSmallForm(component) {
    const availaibleWidth = window.screen.availWidth;
    if (component === "register") {
      setSmallRegisterDisplay(true);
      setSmallLoginDisplay(false);
    } else {
      setSmallRegisterDisplay(false);
      setSmallLoginDisplay(true);
    }
  }
  return (
    <>
      <div
        className={`form-error-message ${
          errorDisplay ? "show-form-error-message" : "hide-form-error-message"
        }`}
      >
        <span className="error-icon">
          <i className="fas fa-exclamation-circle"></i>
        </span>
        <p className="error-text">{errorMessage}</p>
      </div>
      <div
        className={`auth-image ${
          isLoginVisible ? "auth-image-login" : "auth-image-register"
        }`}
      ></div>
      <div className="auth-bg">
        <div className="auth-container flex-row justify-space">
          <div className="register-container width-50 flex-row justify-center align-center">
            <span
              className="auth-link login-link"
              onClick={() => setLoginVisibility(true)}
            >
              Login
            </span>
            {/* Register form */}
            <form
              action="#"
              onSubmit={(e) => registerUser(e)}
              className="auth-form register-form flex-col justify-center align-center"
            >
              <Typography variant="h5" style={{ color: "#FCFCFC" }}>
                Create an Account
              </Typography>
              <div className="form-input-container register-form-input-container flex-row">
                <span className="form-icon flex-row justify-center align-center">
                  <i className="fas fa-user-tie"></i>
                </span>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="form-input"
                  spellCheck="false"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-input-container register-form-input-container flex-row">
                <span className="form-icon flex-row justify-center align-center">
                  <i className="far fa-user-circle"></i>
                </span>
                <input
                  type="text"
                  placeholder="Username"
                  className="form-input"
                  spellCheck="false"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-input-container register-form-input-container flex-row">
                <span className="form-icon flex-row justify-center align-center">
                  <i className="fas fa-at"></i>
                </span>
                <input
                  type="text"
                  placeholder="Email"
                  className="form-input"
                  spellCheck="false"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="register-form-row flex-row justify-space align-center">
                <div className="form-input-container register-form-input-container flex-row width-50">
                  <span className="form-icon flex-row justify-center align-center">
                    <i className="fas fa-key"></i>
                  </span>
                  <input
                    type="password"
                    placeholder="Password"
                    className="form-input"
                    spellCheck="false"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="form-input-container register-form-input-container flex-row width-50">
                  <span className="form-icon flex-row justify-center align-center">
                    <i className="fas fa-key"></i>
                  </span>
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="form-input"
                    spellCheck="false"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex-row align-center remember-me">
                <Checkbox
                  checked={isTermsAccepted}
                  value={isTermsAccepted}
                  onChange={() => setTermsAccepted(!isTermsAccepted)}
                  color="primary"
                  name="rememberMe"
                />
                Terms and Conditions
              </div>
              <button type="submit" className="purple-form-button register-btn">
                Continue
              </button>
            </form>
          </div>

          <div className="login-container width-50 flex-row justify-center align-center">
            <span
              className="auth-link register-link"
              onClick={() => setLoginVisibility(false)}
            >
              Create an account
            </span>
            {/* Login form */}
            <form
              action="#"
              className="auth-form login-form flex-col justify-center align-center"
              onSubmit={(e) => loginUser(e)}
            >
              <Typography variant="h5" style={{ color: "#FCFCFC" }}>
                Login
              </Typography>
              <div className="form-input-container login-form-input-container flex-row">
                <span className="form-icon flex-row justify-center align-center">
                  <i className="far fa-user-circle"></i>
                </span>
                <input
                  type="text"
                  placeholder="Username or email"
                  className="form-input"
                  spellCheck="false"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="form-input-container login-form-input-container flex-row">
                <span className="form-icon flex-row justify-center align-center">
                  <i className="far fa-key"></i>
                </span>
                <input
                  type="password"
                  placeholder="Password"
                  className="form-input"
                  spellCheck="false"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex-row align-center remember-me">
                <Checkbox
                  checked={isRemember}
                  value={isRemember}
                  onChange={() => setRememberMe(!isRemember)}
                  color="primary"
                  name="rememberMe"
                />
                Remember Me
              </div>
              <button className="purple-form-button login-btn">Continue</button>
            </form>
          </div>
        </div>

        <div className="small-forms">
          <div
            className={`register-container width-50 flex-row justify-center align-center ${
              smallRegisterDisplay ? "show-small-form" : "hide-small-form"
            }`}
          >
            <span
              className="auth-link login-link"
              onClick={() => {
                showSmallForm("login");
              }}
            >
              Login
            </span>
            {/* Register form */}
            <form
              action="#"
              className="auth-form register-form flex-col justify-center align-center"
              onSubmit={(e) => registerUser(e)}
            >
              <Typography variant="h5" style={{ color: "#FCFCFC" }}>
                Create an Account
              </Typography>
              <div className="form-input-container register-form-input-container flex-row">
                <span className="form-icon flex-row justify-center align-center">
                  <i className="fas fa-user-tie"></i>
                </span>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="form-input"
                  spellCheck="false"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-input-container register-form-input-container flex-row">
                <span className="form-icon flex-row justify-center align-center">
                  <i className="far fa-user-circle"></i>
                </span>
                <input
                  type="text"
                  placeholder="Username"
                  className="form-input"
                  spellCheck="false"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-input-container register-form-input-container flex-row">
                <span className="form-icon flex-row justify-center align-center">
                  <i className="fas fa-at"></i>
                </span>
                <input
                  type="text"
                  placeholder="Email"
                  className="form-input"
                  spellCheck="false"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="register-form-row flex-row justify-space align-center">
                <div className="form-input-container register-form-input-container flex-row width-50">
                  <span className="form-icon flex-row justify-center align-center">
                    <i className="fas fa-key"></i>
                  </span>
                  <input
                    type="password"
                    placeholder="Password"
                    className="form-input"
                    spellCheck="false"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="form-input-container register-form-input-container flex-row width-50">
                  <span className="form-icon flex-row justify-center align-center">
                    <i className="fas fa-key"></i>
                  </span>
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="form-input"
                    spellCheck="false"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex-row align-center remember-me">
                <Checkbox
                  checked={isTermsAccepted}
                  value={isTermsAccepted}
                  onChange={() => setTermsAccepted(!isTermsAccepted)}
                  color="primary"
                  name="acceppt_terms"
                />
                I accept the Terms and Conditions
              </div>
              <button className="purple-form-button register-btn">
                Continue
              </button>
            </form>
          </div>
          <div
            className={`login-container width-50 flex-row justify-center align-center ${
              smallLoginDisplay ? "show-small-form" : "hide-small-form"
            }`}
          >
            <span
              className="auth-link register-link"
              onClick={() => {
                showSmallForm("register");
              }}
            >
              Create an account
            </span>
            {/* Login form */}
            <form
              action="#"
              className="auth-form login-form flex-col justify-center align-center"
              onSubmit={(e) => loginUser(e)}
            >
              <Typography variant="h5" style={{ color: "#FCFCFC" }}>
                Login
              </Typography>
              <div className="form-input-container login-form-input-container flex-row">
                <span className="form-icon flex-row justify-center align-center">
                  <i className="far fa-user-circle"></i>
                </span>
                <input
                  type="text"
                  placeholder="Username or email"
                  className="form-input"
                  spellCheck="false"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="form-input-container login-form-input-container flex-row">
                <span className="form-icon flex-row justify-center align-center">
                  <i className="far fa-key"></i>
                </span>
                <input
                  type="password"
                  placeholder="Password"
                  className="form-input"
                  spellCheck="false"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex-row align-center remember-me">
                <Checkbox
                  checked={isRemember}
                  value={isRemember}
                  onChange={() => setRememberMe(!isRemember)}
                  color="primary"
                  name="rememberMe"
                />
                Remember Me
              </div>
              <button className="purple-form-button login-btn">Continue</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Auth;
