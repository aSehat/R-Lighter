// User login form
import React, {useState} from 'react';
import "../style/loginSignup.css";
import axios from 'axios';


export default function Login(props) {
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
        console.log(null);
        const payload={
            "email": state.email,
            "password": state.password
        }
        const API_BASE_URL = "/api/auth";
        axios.post(API_BASE_URL, payload)
            .then(function (response) {
                console.log(response);
                if(response.status === 200){
                    setState(prevState => ({
                        ...prevState,
                        'successMessage' : 'Login successful. Redirecting to home page..'
                    }))
                    alert('Login successful. Redirecting to home page...');
                    
                    //window.location = "/"
                    //redirectToHome();
                } else{
                    console.log("Some error occurred");
                }
            })
            .catch(function (error) {
                console.log(error.response.request.response);
            });
    }

    const handleSubmitClick = (e) => {
        e.preventDefault();
        if (state.email.length > 0 && state.password.length > 0) {
            sendDetailsToServer()
        } else {
            console.log('Email or Password not long enough')
        }
    }

    return (
        <>
            <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
                <form>
                    <div className="form-group text-left">
                        <label htmlFor="email1">Email Address</label>
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
                        <label htmlFor="password">Password</label>
                        <input type="password"
                               className="form-control"
                               id="password"
                               placeholder="Enter Password"
                               value={state.password}
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
    )
};
