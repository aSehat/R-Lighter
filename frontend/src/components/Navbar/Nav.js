import React from 'react';
import '../../App.css';
import {Link} from 'react-router-dom';

function Nav() {
  return (
    <nav>
      <h1>RDF-Highlighter</h1>
      <ul className="nav-bar">
        <Link to='/'>
          <li>Home</li>
        </Link>
        <Link to='/Dashboard'>
          <li>Projects Dashboard</li>
        </Link>

          <Link to='/Login'>
              <li>Login</li>
          </Link>
          <Link to='/Signup'>
              <li>Sign up</li>
          </Link>
      </ul>
    </nav>
  );
}

export default Nav;
