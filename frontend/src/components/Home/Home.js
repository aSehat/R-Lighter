import React from 'react';
import '../../App.css';
import Logo from '../../img/logo.svg';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  logoImage: {
    marginTop: theme.spacing(18),
    height: '400px'
  },
  button: {
    margin: theme.spacing.unit,
    marginTop: theme.spacing(10),
    height: '50px',
    fontSize: '20px'
  },
}));

function Home() {
  const classes = useStyles();

  return (
    <div className="main-page">
        <img src ={Logo} alt = "website logo" className={classes.logoImage}/>
        <h3>
          <Link to='/Signup'>
            <Button variant="contained" color="primary" className={classes.button}>
              Get Started!
            </Button>
          </Link>
        </h3>
    </div>

  );
}

export default Home;
