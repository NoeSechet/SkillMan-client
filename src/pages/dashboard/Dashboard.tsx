import React, { useState, useEffect } from "react";
import {
  Typography,
  GridList,
  GridListTile,
  makeStyles,
  createStyles,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import Cookies from "react-cookies";
import Nav from "./Nav";
import Project from "../project/Project";

const axios = require("axios");

interface DashboardProps {}

interface IProject {
  name: string;
  description: string;
  type: string;
  _id: string;
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

const Dashboard: React.FC<DashboardProps> = ({}) => {
  const classes = useStyles();

  const [listProject, setListProject] = useState<IProject[]>([]);

  const getListProject = async () => {
    console.log(Cookies.load("userID"));
    const requestOptions = {
      method: "get",
      url: "http://localhost:8080/project/get/" + Cookies.load("userID"),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + Cookies.load("accessToken"),
      },
    };

    try {
      const res = await axios(requestOptions);
      let validRes = res && res.status === 200 && res.statusText === "OK";
      if (validRes) {
        setListProject(res.data);
      }
    } catch (err) {
      console.error("There was an error:", err.toString());
    }
  };

  useEffect(() => {
    getListProject();
  }, []);
  
  return (
    <>
      <div>
        <Nav />
        <main>
          <div className={classes.root}>
            <GridList cellHeight={160} className={classes.gridList} cols={1}>
              {listProject.map((project) => (
                <GridListTile key={project._id} cols={1}>
                  <Project name={project.name} description={project.description} type={project.type}/>
                </GridListTile>
              ))}
            </GridList>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
