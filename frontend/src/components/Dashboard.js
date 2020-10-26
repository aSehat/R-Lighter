import React, { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardListHeader from "./DashboardListHeader";
import {axios} from 'axios';


// this function will be an axios call to one of the routes (ask ace how to differentiate between the '/' endpoints)
function queryDB() {
  //
}


// implementation of infinite scroll
function dynamicLoad() {
  //
}

export default function Dashboard(props) {
  // the initial value for projects is very expensive to execute, so put it in a function (apparently React stops
  //  unnecessary functions before they execute, but not unnecessary statements)
  const [projects, setProjects] = useState(() => {
    // pull from db and generate a bunch of li elements
  });
  // to avoid ambiguity, ascending means to begin with the smallest/first element (0->9, A->Z, etc)
  const [sortBy, setSortBy] = useState({
    attribute: "name",
    ascending: true,
  });

  // TODO: figure out how to pass the current user to PageHeader after having logged in
  return (
    <div>
      <DashboardHeader user={"HARDCODED USER"}/>
      <DashboardListHeader sortby={sortBy} togglesort={() => this.toggleSort()}/>
      <ol>{projects}</ol>
    </div>
  );
}