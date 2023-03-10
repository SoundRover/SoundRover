import React from 'react';
import './Login.css';
import { accessUrl } from './Spotify'
import logo from './assets/SR-transparent.png'

function Login() {
    return (
        <div className="login">
            <img src={logo}
            alt=""/>
            <a href={accessUrl}>LOGIN THROUGH SPOTIFY</a>
        </div>
    )
}

export default Login