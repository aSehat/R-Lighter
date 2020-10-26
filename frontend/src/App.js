import React from 'react';
import PDFHighlights from './components/pdf-highlighter';
import Signup from './components/signupForm';
import Login from './components/loginForm'
import Nav from './components/Nav';
import Home from'./components/Home';
import Dashboard from './components/Dashboard';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

function App() {
  return (
      <Router>
        <div className="App">
          <Nav />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/PDFHighlights" exact component={PDFHighlights} />
              <Route path="/Login" exact component={Login} />
            <Route path="/Signup" exact component={Signup} />
            <Route path="/Dashboard" exact component={Dashboard} />
          </Switch>
        </div>
      </Router>

  );
}

export default App;
