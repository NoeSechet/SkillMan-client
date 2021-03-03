import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  createStyles,
  makeStyles,
  Snackbar,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

import { Theme } from "@material-ui/core/styles/createMuiTheme";

import GoogleLogin from "./GoogleLogin";
import Cookies from "react-cookies";

const axios = require("axios");

interface LoginProps {}

const useStyles = makeStyles(({ spacing, palette }: Theme) =>
  createStyles({
    container: {
      backgroundColor: "gray",
    },
    paper: {
      marginTop: spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    avatar: {
      margin: spacing(1),
      backgroundColor: palette.secondary.main,
    },
    form: {
      width: "100%",
      marginTop: spacing(1),
    },
    submit: {
      margin: spacing(3, 0, 2),
    },
    signupStyle: {
      textDecoration: "none",
      fontSize: 15,
    },
  })
);

const Login: React.FC<LoginProps> = ({}) => {
  const router = useRouter();
  const classes = useStyles();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signedIn, setSignedIn] = useState(false);

  const [openedToast, setOpenedToast] = useState(false);

  useEffect(() => {
    Cookies.remove("userID");
    Cookies.remove("accessToken");
    Cookies.remove("G_accessToken");
    if (signedIn) {
      router.push("/dashboard/Dashboard");
    }
  }, []);

  const _handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const _handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const loginButtonHandler = async (e) => {
    e.preventDefault();
    const requestOptions = {
      method: "post",
      url: "http://localhost:8080/user/login",
      headers: { "Content-Type": "application/json" },
      data: {
        username: username,
        password: password,
      },
    };

    try {
      const res = await axios(requestOptions);
      Cookies.save("accessToken", res.data.accessToken, { path: "/" });
      Cookies.save("userID", res.data.id, { path: "/" });
      setSignedIn(true);
    } catch (err) {
      setOpenedToast(true);
      console.error("There was an error:", err.toString());
    }
  };

  const Copyright = () => {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {"Copyright © "}
        <Link href="/dashboard/Dashboard">Skillman</Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    );
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form
            className={classes.form}
            onSubmit={loginButtonHandler}
            noValidate
          >
            <TextField
              id="username"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="username"
              value={username}
              onChange={_handleUsernameChange}
            />
            <TextField
              id="password"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={_handlePasswordChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/authentication/Register">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
          <GoogleLogin />
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
      <Snackbar
        open={openedToast}
        autoHideDuration={6000}
        onClose={(e) => setOpenedToast(false)}
      >
        <Alert
          onClose={(e) => setOpenedToast(false)}
          variant="filled"
          severity="error"
        >
          <AlertTitle>Error</AlertTitle>
          Please make sure you filled all the fields correctly and try again
        </Alert>
      </Snackbar>
    </>
  );
};

export default Login;
