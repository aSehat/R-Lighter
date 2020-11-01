import React, { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardListHeader from "./DashboardListHeader";
import ProjectList from "./DashboardProjectList";
import {axios} from 'axios';


// this function will be an axios call to one of the routes (ask ace how to differentiate between the '/' endpoints)
function getProjects() {
  //
}

// call '/me' endpoint
function getUser() {
  //
}


export default function Dashboard(props) {
  // the initial value for projects is very expensive to execute, so put it in a function (apparently React stops
  //  unnecessary functions before they execute, but not unnecessary statements)
  const [projects, setProjects] = useState(() => {
    // TODO: pull from db and generate a bunch of li elements
  });

  // to avoid ambiguity, ascending means to begin with the smallest/first element (0->9, A->Z, etc)
  const [sortBy, setSortBy] = useState({
    attribute: "name",
    ascending: true,
  });

  // I don't think this is necessary, since a username will never change without a forced logout and redirect
  // const [user, setUser] = useState(() => getUser());

  return (
    <div>
      <DashboardHeader user={() => getUser()}/>
      <DashboardListHeader sortby={sortBy} altersort={() => this.toggleSort()}/>
      <ProjectList projects={projects}/>
    </div>
  );
}