
import React, { useState } from 'react';
import { Redirect } from "react-router-dom";
import Cookies from 'react-cookies';

import GoogleLogin from 'react-google-login';

const axios = require('axios');

export default function GoogleBtn() {

    const [signedIn, setSignedIn] = useState(false);

    const loginRegisterRequest = async (url, response) => {

        const requestOptions = {
            method: 'post',
            url: url,
            headers: { 'Content-Type': 'application/json' },
            data: {
                username: response.profileObj.name,
                email: response.profileObj.email,
                googleID: response.googleId
            }
        };
        Cookies.save('G_accessToken', response.accessToken, { path: '/' })

        try {
            const res = await axios(requestOptions)
            let validRes = res && res.status === 200 && res.statusText === 'OK'
            if (validRes) {
                Cookies.save('accessToken', res.data.accessToken, { path: '/' })
                Cookies.save('userID', res.data.id, { path: '/' })
                setSignedIn(true);
            }
        } catch (err) {
            console.error('There was an error:', err.toString());
        }
    }

    const handleLoginSuccess = (response) => {

        console.log('Google response: ', response);

        Cookies.save('G_accessToken', response.accessToken, { path: '/' })

        loginRegisterRequest('http://localhost:8080/user/login/google', response)
    }

    const handleLoginFailure = (response) => {
        console.error(response.errorMessage);
    }

    return (
        signedIn ?
            <Redirect to={'/home'} />
            :
            <div>
                <GoogleLogin
                    clientId={process.env.CLIENT_ID || "1054477661771-3pr6g2g5o6htr8nsg0p4enjrkgupco8g.apps.googleusercontent.com"}
                    buttonText='Login'
                    onSuccess={handleLoginSuccess}
                    onFailure={handleLoginFailure}
                    cookiePolicy={'single_host_origin'}
                />
            </div>

    )
}