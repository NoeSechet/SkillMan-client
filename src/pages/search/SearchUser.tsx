import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import AddIcon from "@material-ui/icons/Add";
import {
  Button,
  TextField,
  Grid,
  GridList,
  GridListTile,
  Container,
  Box,
  makeStyles,
  createStyles
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { Theme } from "@material-ui/core/styles/createMuiTheme";
import Cookies from "react-cookies";
import styles from "./styles/Search.module.css";
import Project from "../project/Project";

const axios = require("axios");
interface SearchUserProps {}

interface IProject {
  name: string;
  description: string;
  type: string;
  _id: string;
}

interface IUser {
  _id: string;
  username: string;
  accessToken: string;
  email: string;
}

const useStyles = makeStyles(({ spacing, palette }: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: palette.background.paper,
    },
    gridList: {
      width: 500,
      height: 450,
    },
  })
);

const SearchUser: React.FC<SearchUserProps> = ({}: SearchUserProps) => {
  const classes = useStyles();
  const router = useRouter();

  const [listProject, setListProject] = useState<IProject[]>([]);
  const [listUser, setListUser] = useState<string[]>([]);
  const [value, setValue] = useState<string | null>(listUser[0]);
  const [inputValue, setInputValue] = useState("");
  const [selectedUser, setSelectedUser] = useState<IUser>();

  useEffect(() => {
    getListUser();
    getListProject();
  }, [selectedUser]);

  const getListProject = async () => {
    if (!selectedUser) return;

    const requestOptions = {
      method: "get",
      url: "http://localhost:8080/project/get/" + selectedUser._id,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + selectedUser.accessToken,
      },
    };

    try {
      const res = await axios(requestOptions);
      let validRes = res && res.status === 200 && res.statusText === "OK";
      if (validRes) {
        console.log("list projects:", res.data);
        setListProject(res.data);
      }
    } catch (err) {
      console.error("There was an error:", err.toString());
    }
  };

  const getListUser = async () => {
    const requestOptions = {
      method: "get",
      url: "http://localhost:8080/user/",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + Cookies.load("accessToken"),
      },
    };

    try {
      const res = await axios(requestOptions);
      let newListUser: string[] = [];
      let i = 0;
      res.data.forEach((user) => {
        newListUser[i] = user.username;
        i += 1;
      });
      console.log("list users:", newListUser);
      setListUser(newListUser);
    } catch (err) {
      console.error("There was an error:", err.toString());
    }
  };

  const handleClickSearchUser = async () => {
    const requestOptions = {
      method: "post",
      url: "http://localhost:8080/user/info",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        username: "Noé Séchet",
      },
    };
    try {
      const res = await axios(requestOptions);
      setSelectedUser(res.data);
    } catch (err) {
      console.error("There was an error:", err.toString());
    }
  };

  const handleGoHomeButton = () => {
    router.push("/dashboard/Dashboard");
  };

  return (
    <>
      <Container>
        <div className={styles.navBar}>
          <ul className="nav-links">
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                Cookies.remove("userID");
                Cookies.remove("accessToken");
                Cookies.remove("G_accessToken");
                handleGoHomeButton();
              }}
            >
              Cancel
            </Button>
          </ul>
        </div>

        <div className={styles.searchBar}>
          <Box>
            <Autocomplete
              value={value}
              onChange={(event: any, newValue: string | null) => {
                setValue(newValue);
              }}
              inputValue={inputValue}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              id="search"
              options={listUser}
              getOptionLabel={(option) => option}
              style={{ width: 250 }}
              renderInput={(params) => (
                <TextField {...params} label="search" variant="outlined" />
              )}
            />
            <Button onClick={handleClickSearchUser}>
              <SearchIcon />
            </Button>
          </Box>
        </div>
      </Container>
      <Container>
        <main>
          <div className={classes.root}>
            <GridList cellHeight={160} className={classes.gridList} cols={1}>
              {listProject.map((project) => (
                <GridListTile key={project._id} cols={1}>
                  <Project
                    name={project.name}
                    description={project.description}
                    type={project.type}
                  />
                </GridListTile>
              ))}
            </GridList>
          </div>
        </main>
      </Container>
    </>
  );
};

export default SearchUser;
