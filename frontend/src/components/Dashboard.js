import React, { useState, useEffect } from "react";
import DashboardListHeader from "./DashboardListHeader";
import ProjectList from "./DashboardProjectList";
import axios from 'axios';
import {ObjectID} from 'bson';
import { useTable } from 'react-table';
import Table from '@material-ui/core/Table';
import { withRouter } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import ProjectDialog from './ProjectDialog';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import AddProjectBtn from './layout/AddProjectBtn';
import './style/Dashboard.css';

const getProjects = (async () => {
  let headers = {
    'x-auth-token': localStorage.getItem("token")
  };
  const result = await axios.get('/api/project', {headers: headers}).then(res => {
    return res.data
  })
  return result;
})


// TODO: infinite scroll or pagination?
// kris would like to use infinite scroll to lazily load annotations
function dynamicLoad(setProjects) {
  //
}


function Dashboard({history,...props}) {
  const [sortBy, setSortBy] = useState({
    attribute: "date",
    ascending: true,
  });

  // this is the array that holds the data used to generate the table
  const [projects, setProjects] = useState(() => {
    return [];
  });

  // retrieve the current user's projects from the database, strip out
  //  unnecessary information, and assign it to the projects array
  useEffect(() => {
    const setProjectsList = async () => {
      let db_ret = await getProjects();
      let projects_relevant_info = db_ret.map((current, move) => {
        return ({
          "_id": current._id,
          "name": current.name,
          "link": current.link,
          "language": current.language,
          "date": current.date,
          "prefix": current.prefix,
        });
      });
      setProjects(projects_relevant_info);
    }
    setProjectsList();
  }, []);

  const editButton = (row) => {
    return (<InfoOutlinedIcon
      className="edit-project"
      variant="contained"
      color="primary"
      onClick={(event) => {event.stopPropagation(); getProjectSettings(row)}}
  >
      Edit
  </InfoOutlinedIcon>);
  }

  // take the array of projects & add the edit button to each row
  // React will reload the table when any of the underlying data changes
  //  (useMemo is solely an optimization)
  const data = React.useMemo(
    () => {
      const projectsList = projects.map((current, step) => {
        return ({
          "_id": current._id,
          "name": current.name,
          "link": current.link,
          "language": current.language,
          "date": current.date,
          "prefix": current.prefix,
          "editButton": editButton(current),
        });
      })
    return projectsList;
  },
    [projects]
  );

  // table headers
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name"
      },{
        Header: "Language",
        accessor: "language"
      },{
        Header: "Date Created",
        accessor: "date"
      }, {
        Header: "Link",
        accessor: "link"
      }, {
        Header: "",
        accessor: "editButton"
      }
    ],
    []
  );


  const tableInstance = useTable({columns, data});
  // weird JS unpacking syntax b/c useTable returns a lot of stuff
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  // redirects the user to the PDF annotation page
  //  (this is called after creating a new project)
  const getProject = (info) => {
    history.push("/project/" + info.original._id);
  }

  // the following 2 are to keep track of which modal popup is currently open
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openUpdate, setOpenUpdate] = React.useState(false);
  // stores a single project's information (used to store the fields of one of the popups)
  const [projectSettings, setProjectSettings] = React.useState(null);


  const getProjectSettings = ((project) => {
    console.log(project);
    setProjectSettings(project);
  })

  // if the fields change and the update modal popup is not already open, then open it
  useEffect(() => {
    if (projectSettings && !openUpdate) {
      handleClickOpen("Update");
    }
  }, [projectSettings]);

  // handles which popup gets opened (create or update)
  const handleClickOpen = (type) => {
    if(type == "Create"){
      setOpenCreate(true);
    } else if (type === "Update"){
      setOpenUpdate(true);
    }
  };

  // properly closes the popup & clears the field data
  const handleClose = (type) => {
    setProjectSettings(null);
    if(type == "Create"){
      setOpenCreate(false);
    } else if (type === "Update"){
      setOpenUpdate(false);
    }
  };

  // take the field data from the popup, send it to the backend (which then sends it to the database)
  //  then redirect the user to the PDF annotation page, loading the PDF URL that the user just provided
  // TODO: error handling!
  const createProject = async (project, newProjCreated) => {
    const headers = {
      "x-auth-token": localStorage.getItem("token")
    };
    const result = await axios.post('/api/project', project, {headers: headers}).then(res => {
      return res.data;
    });
    if (newProjCreated) {
      history.push("/project/" + result._id);
    }
  };

  // TODO: to update the table without calling the db again, i need the index (in the projects array) of the row that just got deleted
  //  if pagination stores the entire table in memory all the time, then (max_rows_per_page*page_num-1)+row_num == index in projects array
  //  if pagination does NOT store the entire table in memory all the time, then row_num == index in projects array?
  //    the above formula is also probably true for infinite scroll
  // once I have that index, I can call projects.delete (or whatever the array method is called) and the table should automatically update
  const deleteProject = async (project) => {
    const options = {
      headers: {"x-auth-token": localStorage.getItem("token")}
    }
    const result = await axios.delete('/api/project/'+project._id, options).then(res => {
      console.log(res.data);
      return res.data;
    });
    return result;
  }


  return (
    <div>
      <div className="projects">
      <AddProjectBtn open={() => handleClickOpen("Create")}/>
      <Table {...getTableProps()} component={Paper}>
        <DashboardListHeader headergroups={headerGroups} sortby={sortBy} setsortby={(newState) => setSortBy(newState)}/>
        <ProjectList getproject={getProject} getProjectSettings={(project) => getProjectSettings(project)} gettablebodyprops={getTableBodyProps} rows={rows} preparerow={prepareRow} sortby={sortBy} projects={projects} loadmore={() => dynamicLoad(setProjects)}/>
      </Table>
      <ProjectDialog inputType="Create" open={openCreate} onConfirm={(project) => createProject(project, true)} onClose={() => handleClose("Create")} />
      <ProjectDialog inputType="Update" inputProjectFields={projectSettings} open={openUpdate} onDelete={(project) => deleteProject(project)} onConfirm={(project) => createProject(project, false)} onClose={() => handleClose("Update")} />
      </div>
    </div>
  );
}

export default withRouter(Dashboard);