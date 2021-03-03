import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import {
  Button,
  TextField,
  Container,
  Snackbar,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import Cookies from "react-cookies";
import Nav from "./Nav";

const axios = require("axios");

interface AddProjectProps {}

const AddProject: React.FC<AddProjectProps> = ({}) => {

  const router = useRouter();
  
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectType, setProjectType] = useState("");

  const [openedErrorToast, setOpenedErrorToast] = useState(false);

  const handleSaveProject = async () => {
    const requestOptions = {
      method: "post",
      url: "http://localhost:8080/project/add",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + Cookies.load("accessToken"),
      },
      data: {
        name: projectName,
        description: projectDescription,
        type: projectType,
        userID: Cookies.load("userID"),
      },
    };

    try {
      await axios(requestOptions);
      console.log("Project added");
      router.push("/dashboard/Dashboard");
    } catch (err) {
      setOpenedErrorToast(true);
      console.error("There was an error:", err.toString());
    }
  };

  return (
    <>
      <Nav />
      <Container maxWidth="sm">
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="name"
          type="name"
          fullWidth
          onChange={(e) => {
            setProjectName(e.target.value);
          }}
        />
        <TextField
          autoFocus
          margin="dense"
          id="description"
          label="description"
          type="description"
          fullWidth
          onChange={(e) => {
            setProjectDescription(e.target.value);
          }}
        />
        <TextField
          autoFocus
          margin="dense"
          id="type"
          label="type"
          type="type"
          fullWidth
          onChange={(e) => {
            setProjectType(e.target.value);
          }}
        />
        <Button onClick={handleSaveProject}>Save Project</Button>
      </Container>
      <Snackbar
        open={openedErrorToast}
        autoHideDuration={6000}
        onClose={(e) => setOpenedErrorToast(false)}
      >
        <Alert
          onClose={(e) => setOpenedErrorToast(false)}
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

export default AddProject;
