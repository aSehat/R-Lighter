import React, { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardListHeader from "./DashboardListHeader";
import ProjectList from "./DashboardProjectList";
import axios from 'axios';
import ObjectID from 'bson';


// this function will be an axios call to one of the routes
// TODO: what is the max number of documents that the database will return?
function getProjects() {
  //TODO: this is temporary code to read from a hardcoded json file, replace with the real deal
  let json = require('/Users/macbookpro/Documents/GitHub/MITR-Project/frontend/src/components/DELETE_ME_testProjects.json');
  return json;
}

// call '/me' endpoint
function getUser() {
  // TODO: uhhh how do i get a user's ID??
  let uid = new ObjectID("5f88d87e3185332ae039ff0f");
  let config = {
    "user": {"id": uid}
  };
  axios.get('http://localhost:5000/api/profile/me', config)
    .then((response) => {
      return response;
    });
}


export default function Dashboard(props) {
  // to avoid ambiguity, ascending means to begin with the smallest/first element (0->9, A->Z, etc)
  const [sortBy, setSortBy] = useState({
    attribute: "name",
    ascending: true,
  });

  // the initial value for projects is expensive to execute, so put it in a function (apparently React stops
  //  unnecessary functions before they execute, but not unnecessary statements)
  const [projects, setProjects] = useState(() => {
    // an array of project documents from the database
    let db_ret = getProjects();
    let projects_relevant_info = db_ret.map((current, move) => {
      // TODO: do we care about the owner?
      return ({
        "_id": current._id,
        "name": current.name,
        "link": current.link,
        "language": current.language,
        "date": current.date
      });
    });
    return projects_relevant_info;
  });


  // I don't think this is necessary, since a username will never change without a forced logout and redirect
  // const [user, setUser] = useState(() => getUser());

  return (
    <div>
      <DashboardHeader user={() => getUser()}/>
      <DashboardListHeader sortby={sortBy} altersort={(newState) => setSortBy(newState)}/>
      <ProjectList sortby={sortBy} projects={projects}/>
      <p>sort by: {sortBy.attribute}</p>
    </div>
  );
}