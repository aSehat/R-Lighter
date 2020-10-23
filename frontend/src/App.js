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
        <link rel="stylesheet"
                href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
                integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
                crossOrigin="anonymous"/>
      </Router>
      
  );
}

export default App;
