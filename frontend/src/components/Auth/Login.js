// User login form
import React, {useState} from 'react';
import "../style/loginSignup.css";
import setAuthToken from '../../utils/setAuthToken';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import {withRouter} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
}));

function Login({history ,...props}) {
    const styles = useStyles();

    const [state , setState] = useState({
        email : "",
        password : ""
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
            "email": state.email,
            "password": state.password
        }
        const API_BASE_URL = "/api/auth";
        axios.post(API_BASE_URL, payload)
            .then(function (response) {
                if(response.status === 200){
                    setState(prevState => ({
                        ...prevState,
                        'successMessage' : 'Login successful. Redirecting to home page..'
                    }))
                    alert('Login successful. Redirecting to home page...');
                    setAuthToken(response.data.token);
                    history.push("/Dashboard");
                } else{
                    alert("Incorrect username or password");
                }
            })
            .catch(function (error) {
                alert(error.response.request.response);
            });
    }

    const handleSubmitClick = (e) => {
        e.preventDefault();
        if (state.email.length > 0 && state.password.length > 0) {
            sendDetailsToServer()
        } else {
            alert('Email or Password not long enough')
        }
    }

    return (
    <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={styles.paper}>
            <Typography component="h1" variant="h5">
            Login
            </Typography>
            <form className={styles.form} noValidate>
                <TextField 
                    type="email"
                    name="email"
                    id="email"
                    aria-describedby="emailHelp"
                    placeholder="Enter Email"
                    value={state.email}
                    onChange={handleChange}
                    variant="outlined"
                    margin="normal"
                    label="Email Address"
                    required
                    fullWidth
                    autoFocus
                />
                <TextField 
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter Password"
                    value={state.password}
                    onChange={handleChange}
                    variant="outlined"
                    margin="normal"
                    label="Password"
                    required
                    fullWidth
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={styles.submit}
                    onClick={handleSubmitClick}
                >
                    Login
                </Button>
            </form>
        </div>
    </Container>
    )
};

export default withRouter(Login);