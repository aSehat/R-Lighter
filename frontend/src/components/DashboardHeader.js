import React, { useState } from "react";
import {Link} from 'react-router-dom';
import SearchBar from "./SearchBar";

export default function DashboardHeader(props) {
  // idk if this is necessary, might be nice
  // let user_info = props.getuser();
  // console.log(user_info);
  const testProject = {
    "_id": "13",
    "users": ["dont care"],
    "annotations": ["dont care"],
    "resources": ["dont care"],
    "language": "EN",
    "name": "MMMM",
    "link": "https://arxiv.org/pdf/1708.08021.pdf",
    "owner": "dont care - probably",
    "date": "1604610329490"
  };
  return (
    <div className="inline">
      <Link to='/PDFHighlights'>
        <button>Create Project</button>
      </Link>
      <button onClick={() => props.createproject(testProject)}>test updateDB</button>
      <SearchBar query={() => props.setquery()}></SearchBar>
      <p>logout functionality here</p>
    </div>
  );
}