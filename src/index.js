import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Auth from './Components/Auth.js';
ReactDOM.render(
  <Router>
    <App/>
    <Route exact path="/auth" component={Auth} />
  </Router>,
  document.getElementById('root')
);