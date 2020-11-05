import React, { useState } from "react";
import {Link} from 'react-router-dom';
import SearchBar from "./SearchBar";

export default function DashboardHeader(props) {
  // idk if this is necessary, might be nice
  // let user_info = props.getuser();
  // console.log(user_info);
  return (
    <div className="inline">
      <Link to='/PDFHighlights'>
        <button>Create Project</button>
      </Link>
      <SearchBar query={() => props.setquery()}></SearchBar>
      <p>logout functionality here</p>
    </div>
  );
}