import React, { useState, useEffect } from "react";
import DashboardListHeader from "./DashboardListHeader";
import ProjectList from "./DashboardProjectList";
import axios from 'axios';
import {ObjectID} from 'bson';
import { useTable } from 'react-table';
import Table from '@material-ui/core/Table';
import { withRouter } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import CreateProjectDialog from './CreateProjectDialog';

import AddProjectBtn from './layout/AddProjectBtn';
import './style/Dashboard.css';
// this function will be an axios call to one of the routes
// TODO: what is the max number of documents that the database will return?
const getProjects = (async () => {
  //TODO: this is temporary code to read from a hardcoded json file, replace with the real deal
  let headers = {
    'x-auth-token': localStorage.getItem("token")
  };
  const result = await axios.get('/api/project', {headers: headers}).then(res => {
    return res.data
  })
  return result;
})

// call '/me' endpoint
// TODO: do I need this??
function getUser() {
  // TODO: uhhh how do i get a user's ID?? as of now I've just hardcoded a test user
  let uid = ObjectID.createFromHexString("5f88d87e3185332ae039ff0f");
  let config = {
    headers: {
      "x-auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWY5NWYzNWM2NGY5ZmFiNGE0Y2M5NjI5In0sImlhdCI6MTYwNDYzNTE2MywiZXhwIjoxNjA0NjM4NzYzfQ.ALTmTA71JG8QLY6jYX7PUgo-b2qehNhIH2p6ylYqXCs"
    },
    params: {
      user: {id: uid}
    }
  };
  return ({
    "name": "Ace"
  });
}


// TODO: implementation of infinite scroll
function dynamicLoad(setProjects) {
  //
}


function Dashboard({history,...props}) {
  // to avoid ambiguity, ascending means to begin with the smallest/first element (0->9, A->Z, etc)
  const [sortBy, setSortBy] = useState({
    attribute: "date",
    ascending: true,
  });

  // the initial value for projects is expensive to execute, so put it in a function (apparently React stops
  //  unnecessary functions before they execute, but not unnecessary statements)
  const [projects, setProjects] = useState(() => {
    // an array of project documents from the database
    return [];
  });

  useEffect(() => {
    const setProjectsList = async () => {
      let db_ret = await getProjects();
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
      setProjects(projects_relevant_info);
    }
    setProjectsList();
  }, []);

  // TODO: write the code to update the db with a new project
  //  this should also probably redirect and be async??
  let updateDB = (newProject) => {
    console.log(newProject);
    console.log("if only it were that easy");
  };


  // table data
  const data = React.useMemo(
    () => {
      const projectsList = projects.map((current, step) => {
        return ({
          "_id": current._id,
          "name": current.name,
          "link": current.link,
          "language": current.language,
          "date": current.date
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
        Header: "Date",
        accessor: "date"
      }, {
        Header: "Link",
        accessor: "link"
      }
    ],
    []
  );

    const updateMyData = () => {
      //
    }

  // custom cell renderer
  const EditableCell = ({
    value: initialValue,
    row: {index},
    column: {id},
    updateMyData,
  }) => {
    const [value, setValue] = React.useState(initialValue);
    const onChange = e => {
      setValue(e.target.value);
    }

    const onBlur = () => {
      updateMyData(index, id, value);
    }

    React.useEffect(() => {
      setValue(initialValue)
    }, [initialValue]);

    return <input value={value} onChange={onChange} onBlur={onBlur} />
  };

  // make custom cell renderer available to cell.render() in DashboardProjectList.js
  const editableCell = {
    EditableCell: EditableCell,
  }

  const tableInstance = useTable({columns, data, editableCell, updateMyData});
  // useTable returns a whole bunch of stuff
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  const getProject = (info) => {
    history.push("/project/" + info.original._id);
  }


  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  const createProject = async (project) => {
    const headers = {
      "x-auth-token": localStorage.getItem("token")
    }
    //TODO: this is temporary code to read from a hardcoded json file, replace with the real deal
    const result = await axios.post('/api/project', project, {headers: headers}).then(res => {
      return res.data
    })
    return result;
  }

  // I don't think this is necessary, since a username will never change without a forced logout and redirect
  // const [user, setUser] = useState(() => getUser());

  const handlePopupFunctions = {
    handleclickopen: handleClickOpen,
    handleclose: handleClose,
    open: open,
    onconfirm: createProject
  }

  return (
    <div>
      <div className="projects">
      <AddProjectBtn open={handleClickOpen}/>
      <Table {...getTableProps()} component={Paper}>
        <DashboardListHeader headergroups={headerGroups} sortby={sortBy} setsortby={(newState) => setSortBy(newState)}/>
        <ProjectList getproject={getProject} gettablebodyprops={getTableBodyProps} rows={rows} preparerow={prepareRow} sortby={sortBy} projects={projects} loadmore={() => dynamicLoad(setProjects)}/>
      </Table>
      <CreateProjectDialog  open={open} onConfirm={(project) => createProject(project)} onClose={() => handleClose()} />
      </div>
    </div>
  );
}

export default withRouter(Dashboard);