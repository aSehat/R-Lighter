// User registration form
import React, {useState} from 'react';
import "../style/loginSignup.css";
import axios from 'axios';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { FormControl } from '@material-ui/core';
import { FormHelperText } from '@material-ui/core';

// styles for the content of the page
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

// sets user info, and sends the data to the API
function Signup({history,...props}) {
    const styles = useStyles();
    const [state , setState] = useState({
        name: "",
        email : "",
        password : "",
        confirmPassword: ""
    });

    // changes name, email, password, and confirm password when user types in field
    const handleChange = (e) => {
        const {id , value} = e.target
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    };

    // does some error checking, sends info to API, and returns success or error message
    const sendDetailsToServer = () => {
        const payload={
            "name": state.name,
            "email": state.email,
            "password": state.password
        }
        // redirects user to login page, so they have to login again after signing up
        const API_BASE_URL = "/api";
        axios.post(API_BASE_URL+'/users', payload)
            .then(function (response) {
                if(response.status === 200){
                    setState(prevState => ({
                        ...prevState,
                        'successMessage' : 'Registration successful. Redirecting to login page...'
                    }))
                    history.push("/Login");
                } else {
                    setState(prevState => ({
                        ...prevState,
                        'errorMessage' : 'Some error occurred'
                    }))
                }
            })
            .catch(function (error) {
                var theError = JSON.parse( error.response.request.response );
                setState(prevState => ({
                    ...prevState,
                    'errorMessage' : theError.errors[0].msg
                }))
            });
    }

    // basic error checkin gwhen form is submitted before form is sent to API
    const handleSubmitClick = (e) => {
        e.preventDefault();
        if (state.password === state.confirmPassword) {
            if (state.email.length > 5 && state.password.length > 8 &&
            state.name.length > 0 ) {
                sendDetailsToServer()
            } else {
                setState(prevState => ({
                    ...prevState,
                    'errorMessage' : 'Name, Email, and / or Password is not long enough'
                }))
            }
        } else {
            setState(prevState => ({
                ...prevState,
                'errorMessage' : 'Passwords do not match'
            }))
        }
    }

    // actual content of the webpage
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={styles.paper}>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <form className={styles.form} noValidate>
                    <Grid container spacing={2}>
                        <FormControl>
                            { state.errorMessage &&
                                <FormHelperText id="my-helper-text" error={true}> { state.errorMessage } </FormHelperText> }
                            { state.successMessage &&
                                <FormHelperText id="my-helper-text"> { state.successMessage } </FormHelperText> }
                        </FormControl>
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