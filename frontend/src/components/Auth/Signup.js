// User registration form
import React, {useState} from 'react';
import "../style/loginSignup.css";
import axios from 'axios';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
}));

function Signup({history,...props}) {
    const styles = useStyles();
    const [state , setState] = useState({
        name: "",
        email : "",
        password : "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        const {id , value} = e.target
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    };

    const sendDetailsToServer = () => {
        const payload={
            "name": state.name,
            "email": state.email,
            "password": state.password
        }
        const API_BASE_URL = "/api";
        axios.post(API_BASE_URL+'/users', payload)
            .then(function (response) {
                if(response.status === 200){
                    setState(prevState => ({
                        ...prevState,
                        'successMessage' : 'Registration successful. Redirecting to home page..'
                    }))
                    history.push("/Dashboard");
                } else{
                    console.log("Some error occurred");
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const handleSubmitClick = (e) => {
        e.preventDefault();
        if (state.password === state.confirmPassword) {
            if (state.email.length > 0 && state.password.length > 0 &&
            state.name.length > 0 ) {
                sendDetailsToServer()
            } else {
                console.log('Name, Email, or Password are not long enough')
            }
        } else {
            console.log('Passwords do not match');
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={styles.paper}>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <form className={styles.form} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField 
                                type="name"
                                id="name"
                                placeholder="Enter Name"
                                name="name"
                                value={state.name}
                                onChange={handleChange}
                                variant="outlined"
                                required
                                fullWidth
                                label="Name"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                type="email"
                                id="email"
                                name="email"
                                aria-describedby="emailHelp"
                                placeholder="Enter Email"
                                value={state.email}
                                onChange={handleChange}
                                label="Email Address"
                                variant="outlined"
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="password"
                                id="password"
                                placeholder="Enter Password"
                                name="password"
                                label="Password"
                                value={state.password}
                                onChange={handleChange}
                                variant="outlined"
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="password"
                                id="confirmPassword"
                                placeholder="Confirm Password"
                                label="Confirm Password"
                                name="confirm password"
                                value={state.confirmPassword}
                                onChange={handleChange}
                                variant="outlined"
                                required
                                fullWidth
                            />
                        </Grid>
                        <Button
                            type="submit"
                            className={styles.submit}
                            onClick={handleSubmitClick}
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            Sign up
                        </Button>
                    </Grid>
                </form>
            </div>
        </Container>
    );
};

export default withRouter(Signup);