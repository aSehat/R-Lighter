import React, { useState } from "react";
import {Link} from 'react-router-dom';
import SearchBar from "./SearchBar";
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import CreateProjectDialog from './CreateProjectDialog'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function DashboardHeader(props) {
  const classes = useStyles();
  // idk if this is necessary, might be nice
  // let user_info = props.getuser();
  // console.log(user_info);

  return (
    <div className="inline">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>

          <Button color="inherit" onClick={props.handlepopup.handleclickopen}>
            Create Project
          </Button>
          <Button color="inherit">Login</Button>
          <CreateProjectDialog  open={props.handlepopup.open} onConfirm={props.handlepopup.onconfirm} onClose={props.handlepopup.handleclose} />
        </Toolbar>
      </AppBar>
      {/* <Link to='/PDFHighlights'>
        <button>Create Project</button>
      </Link>
      <button onClick={() => props.createproject(testProject)}>test updateDB</button>
      <SearchBar query={() => props.setquery()}></SearchBar>
      <p>logout functionality here</p> */}
    </div>
  );
}