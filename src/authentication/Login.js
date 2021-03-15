import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import GoogleLoginButton from './GoogleLoginButton.js';
import Cookies from 'react-cookies'

import '../style/RegisterButton.css';
import '../style/LoginPage.css';

const axios = require('axios');

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    signupStyle: {
        textDecoration: 'none',
        fontSize: 15
    }
}))

export default function Login() {

    const classes = useStyles();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [signedIn, setSignedIn] = useState(false);

    useEffect(() => {
        Cookies.remove('userID');
        Cookies.remove('accessToken');
        Cookies.remove('G_accessToken');
    }, [])

    const _handleUsernameChange = (e) => {
        setUsername(e.target.value);
    }

    const _handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const loginButtonHandler = async (e) => {
        e.preventDefault();
        const requestOptions = {
            method: 'post',
            url: 'http://localhost:8080/user/login',
            headers: { 'Content-Type': 'application/json' },
            data: {
                username: username,
                password: password
            }
        }

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

    const Copyright = () => {
        return (
            <Typography variant="body2" color="textSecondary" align="center">
                {'Copyright © '}
                <Link color="inherit" href="https://dashboard.com/" to="/">
                    Skillman
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        );
    }

    if (signedIn) {
        return (<Redirect to={'/home'} />)
    } else {
        return (

            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form className={classes.form} onSubmit={loginButtonHandler} noValidate>
                        <TextField
                            id="username"
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="username"
                            value={username}
                            onChange={_handleUsernameChange} />
                        <TextField
                            id="password"
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={_handlePasswordChange} />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}>
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link to="/register" href="#" variant="body2" className={classes.signupStyle}>
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                    <GoogleLoginButton />
                </div>
                <Box mt={8}>
                    <Copyright />
                </Box>
            </Container>
        )
    }
};