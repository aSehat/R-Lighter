import React from 'react';
import '../App.css';
import {Link} from 'react-router-dom';

function Nav() {
  return (
    <nav>
      <h1>RDF-Highlighter</h1>
      <ul className="nav-bar">
        <Link to='/'>
           <li>Home</li>
        </Link>
        <Link to='/PDFHighlights'>
          <li>Create Project</li>
        </Link>
          
        <li>Login</li>
        <li>Sign up</li>
      </ul>
    </nav>
  );
}

export default Nav;
