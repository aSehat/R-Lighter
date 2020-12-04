import React from 'react';
import '../../App.css';
import {Link} from 'react-router-dom';

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
    color: 'white',
    '&:hover': {
      color: 'white',
      textDecoration: 'none'
    }
  },
  button: {
    color: 'white',
    '&:hover': {
      color: 'white'
    }
  },
}));

export default function Nav() {
  const classes = useStyles();

  return (
    <div className ={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title} component={Link} to={'/'}>
            R - Lighter
          </Typography>
          
          <Button component={Link} to={'/Login'} className={classes.button}>Login</Button>
          <Button component={Link} to={'/Signup'} className={classes.button}>Sign Up</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};
