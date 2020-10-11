import React from 'react';
import './App.css';
import Logo from './rdf-beatles.png';
import styled from 'styled-components';
const Button = styled.button`
    background-color:blue;
    color:white;
    cursor:pointer;



`
function Home() {
  return (
    <home>
        <img src ={Logo} alt = "website logo" />
        <h3><Button>GET STARTED</Button> </h3>
        
    </home>

  );
}

export default Home;
