import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import AddIcon from "@material-ui/icons/Add";
import {
  Button,
  makeStyles,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  createStyles,
  InputBase,
} from "@material-ui/core";
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

  const [openDialog, setOpenDialog] = useState(false);

  const handleCancelButton = () => {
    router.push("/dashboard/Dashboard");
  };

  return (
    <>
      <div className={styles.navBar}>
        <ul className="nav-links">
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              Cookies.remove("userID");
              Cookies.remove("accessToken");
              Cookies.remove("G_accessToken");
              handleCancelButton()
            }}
          >
            Cancel
          </Button>
        </ul>
      </div>
    </>
  );
};

export default Nav;
