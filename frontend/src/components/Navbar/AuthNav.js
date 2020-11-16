import React, { Fragment } from 'react';
import '../../App.css';
import {Link, withRouter} from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';


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
  button: {
    color: 'white',
    '&:hover': {
      color: 'white'
    }
  },
}));

function Nav({history}) {
  const classes = useStyles();

  const logout = () => {
    localStorage.clear();
    history.push("/");
  }

  return (
    <div className ={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            R - Lighter
          </Typography>
          
          <Button component={Link} to={'/Dashboard'} className={classes.button}>Dashboard</Button>
          <Button color="inherit" onClick={() => logout()}>Logout</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default withRouter(Nav);