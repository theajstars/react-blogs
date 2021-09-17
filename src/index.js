import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Auth from "./Components/Auth.js";
import Feed from "./Components/Auth/Feed.js";
import CreatePost from "./Components/Auth/CreatePost.jsx";
import ViewPost from "./Components/Auth/ViewPost.jsx";
import Profile from "./Components/Auth/Profile.jsx";
ReactDOM.render(
  <Router>
    <App />
    <Route exact path="/" component={Auth} />
    <Route exact path="/auth" component={Auth} />
    <Route exact path="/feed" component={Feed} />
    <Route exact path="/profile" component={Profile} />
    <Route exact path="/post/create" component={CreatePost} />
    <Route path="/post/view/" component={ViewPost} />
  </Router>,
  document.getElementById("root")
);
