// User registration form
import React, {useState} from 'react';
import "./style/loginSignup.css";
import Header from './signupHeader';
import {axios} from 'axios';


export default function Signup(props) {
    const [state , setState] = useState({
        email : "",
        password : "",
        first_name: "",
        last_name: "",
        company: ""
    });

    const handleChange = (e) => {
        const {id , value} = e.target
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    };

    const sendDetailsToServer = () => {
        props.showError(null);
        const payload={
            "email": state.email,
            "password": state.password,
            "first_name": state.first_name,
            "last_name": state.last_name,
            "company": state.company
        }
        const API_BASE_URL = "";
        axios.post(API_BASE_URL+'/user/register', payload)
            .then(function (response) {
                if(response.status === 200){
                    setState(prevState => ({
                        ...prevState,
                        'successMessage' : 'Registration successful. Redirecting to home page..'
                    }))
                    //redirectToHome();
                    props.showError(null)
                } else{
                    props.showError("Some error ocurred");
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
            state.first_name.length > 0 && state.last_name.length > 0 &&
            state.company.length > 0) {
                sendDetailsToServer()
            } else {
                props.showError('Email, Password, First Name, Last Name, or Comapny Name not long enough')
            }
        } else {
            props.showError('Passwords do not match');
        }
    }

    return (
        <>
            <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
                <form>
                    <div className="form-group text-left">
                        <label htmlFor="firstName">First Name</label>
                        <input type="firstName"
                               className="form-control"
                               id="first"
                               placeholder="Enter First Name"
                               value={state.first_name}
                               onChange={handleChange}
                        />
                    </div>
                    <div className="form-group text-left">
                        <label htmlFor="lastName">Last Name</label>
                        <input type="lastName"
                               className="form-control"
                               id="last"
                               placeholder="Enter Last Name"
                               value={state.first_name}
                               onChange={handleChange}
                        />
                    </div>
                    <div className="form-group text-left">
                        <label htmlFor="companyName">Company</label>
                        <input type="companyName"
                               className="form-control"
                               id="company"
                               placeholder="Enter Company Name"
                               value={state.first_name}
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
