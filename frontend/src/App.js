import React from 'react';
import PDFHighlights from './components/pdf-highlighter';
import Signup from './components/signupForm';
import Login from './components/loginForm'
import Header from './components/signupHeader'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

function App() {
  return (
      <Router>
        <div className="container d-flex align-items-center flex-column">
          <Switch>
            <Route path="/" exact={true}>
              <Signup />
            </Route>
          </Switch>
        </div>
        <link rel="stylesheet"
                href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
                integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
                crossOrigin="anonymous"/>
      </Router>
    //<PDFHighlights/>
  );
}

export default App;
