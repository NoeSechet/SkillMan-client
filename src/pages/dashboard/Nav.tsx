import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import AddIcon from "@material-ui/icons/Add";
import { Button, makeStyles, createStyles } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import Cookies from "react-cookies";
import styles from "./styles/Nav.module.css";

const axios = require("axios");

interface NavProps {}

const useStyles = makeStyles(({ spacing, palette }: Theme) =>
  createStyles({
    root: {
      maxWidth: 345,
    },
    div: {
      alignItems: "fill",
    },
    media: {
      height: 140,
    },
    navStyle: {
      color: "white",
      textDecoration: "none",
    },
  })
);

const Nav: React.FC<NavProps> = ({}) => {
  const anchorRef = useRef(null);
  const classes = useStyles();
  const router = useRouter();

  const handleAddProjectButton = () => {
    router.push("/project/AddProject");
  };

  const handleSearchButton = () => {
    router.push("/search/SearchUser");
  };

  return (
    <>
      <div className={classes.div}>
        <nav className={styles.navBar}>
          <Button
            ref={anchorRef}
            aria-haspopup="true"
            onClick={handleAddProjectButton}
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
          >
            Add Project
          </Button>

          <Button
            ref={anchorRef}
            aria-haspopup="true"
            onClick={handleSearchButton}
            variant="contained"
            color="primary"
            startIcon={<SearchIcon />}
          >
            Search user
          </Button>

          <ul className="nav-links">
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                Cookies.remove("userID");
                Cookies.remove("accessToken");
                Cookies.remove("G_accessToken");
              }}
            >
              <Link href="/authentication/Login">Logout</Link>
            </Button>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Nav;
