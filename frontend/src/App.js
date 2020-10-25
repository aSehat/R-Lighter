import React from 'react';
import PDFHighlights from './components/pdf-highlighter';
import Signup from './components/signupForm';
import Login from './components/loginForm'
import Header from './components/signupHeader'
import Nav from './components/Nav';
import Home from'./components/Home';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

function App() {
  return (      
      <Router>
        <div className="App">
          <Nav />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/PDFHighlights" exact component={PDFHighlights} />
          </Switch>
        </div>
      </Router>
      
  );
}

export default App;
