// User registration form
import React, {useState} from 'react';
import "./style/loginSignup.css";
import {axios} from 'axios';


export default function Signup(props) {
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
        console.log(null);
        const payload={
            "name": state.name,
            "email": state.email,
            "password": state.password
        }
        const API_BASE_URL = "";
        axios.post(API_BASE_URL+'/', payload)
            .then(function (response) {
                if(response.status === 200){
                    setState(prevState => ({
                        ...prevState,
                        'successMessage' : 'Registration successful. Redirecting to home page..'
                    }))
                    //redirectToHome();
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
        <>
            <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
                <form>
                    <div className="form-group text-left">
                        <label htmlFor="name">Name</label>
                        <input type="name"
                               className="form-control"
                               id="name"
                               placeholder="Enter Name"
                               value={state.name}
                               onChange={handleChange}
                        />
                    </div>
                    <div className="form-group text-left">
                        <label htmlFor="email">Email Address</label>
                        <input type="email"
                               className="form-control"
                               id="email"
                               aria-describedby="emailHelp"
                               placeholder="Enter Email"
                               value={state.email}
                               onChange={handleChange}
                        />
                    </div>
                    <div className="form-group text-left">
                        <label htmlFor="password1">Password</label>
                        <input type="password"
                               className="form-control"
                               id="password"
                               placeholder="Enter Password"
                               value={state.password}
                               onChange={handleChange}
                        />
                    </div>
                    <div className="form-group text-left">
                        <label htmlFor="password2">Confirm Password</label>
                        <input type="password"
                               className="form-control"
                               id="confirmPassword"
                               placeholder="Confirm Password"
                               value={state.confirmPassword}
                               onChange={handleChange}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={handleSubmitClick}
                    >
                        Register
                    </button>
                </form>
            </div>
        </>
    );
};
