import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom';

import Cookie from 'react-cookies'

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

export default class Register extends Component {

    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            email: '',
            accessToken: ''
        };
    };

    _handleUsernameChange = (e) => {
        this.setState({
            username: e.target.value
        });
    }

    _handleEmailChange = (e) => {
        this.setState({
            email: e.target.value
        });
    }

    _handlePasswordChange = (e) => {
        this.setState({
            password: e.target.value
        });
    }

    registerButtonHandler = (e) => {
        e.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'username': this.state.username,
                'email': this.state.email,
                'password': this.state.password
            })
        };

        fetch('http://localhost:8080/user/register', requestOptions)
            .then(async res => {
                const data = await res.json();
                if (res.ok === false) {
                    const error = (data && data.error) || res.status;
                    return Promise.reject(error);
                }

                this.setState({ accessToken: data.accessToken }, () => console.log('Response received:', data.accessToken));
                Cookie.save('accessToken', this.state.accessToken, { path: '/' })
            })
            .catch((err) => {
                this.setState({ errorMessage: err.toString() });
                console.error('There was an error.', err.toString());
            });
    };

    Copyright() {
        return (
            <Typography variant="body2" color="textSecondary" align="center">
                {'Copyright © '}
                <Link color="inherit" href="https://dashboard.com/" to="/">
                    Dashboard
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        );
    }

    useStyles() {
        return makeStyles((theme) => ({
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
            }
        }))
    }

    render() {

        const { username, password, email } = this.state
        const classes = this.useStyles();

        if (this.state.accessToken !== '') {
            return <Redirect to={'/home'} />
        }

        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign Up
                    </Typography>
                    <form className={classes.form} onSubmit={this.registerButtonHandler} noValidate>
                        <TextField
                            id="username"
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="username"
                            value={username}
                            onChange={this._handleUsernameChange} />
                        <TextField
                            id="email"
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="email"
                            value={email}
                            onChange={this._handleEmailChange} />
                        <TextField
                            id="password"
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={this._handlePasswordChange} />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}>
                            Sign Up
                        </Button>
                    </form>
                </div>
                <Box mt={8}>
                    <this.Copyright />
                </Box>
            </Container>
        );
    }
}