import React from 'react';
import PDFHighlights from './components/PDF-highlighter/pdf-highlighter';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login'
import Nav from './components/Navbar/Nav';
import AuthNav from './components/Navbar/AuthNav';
import Home from'./components/Home/Home';
import withAuth from './components/Auth/withAuth';
import Dashboard from './components/Dashboard';

import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

function App() {
  return (
      <Router>
        <div className="App">
          <Route path={["/", "/Login", "/Signup"]} exact component={Nav}/>
          <Route path={["/Dashboard", "project/:id"]} exact component={withAuth(AuthNav)}/>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/Login" exact component={Login} />
            <Route path="/project/:id" exact component={withAuth(PDFHighlights)} />
            <Route path="/Login" exact component={Login} />
            <Route path="/Signup" exact component={Signup} />
            <Route path="/Dashboard" exact component={withAuth(Dashboard)} />
          </Switch>
        </div>
      </Router>
  );
}

export default App;
