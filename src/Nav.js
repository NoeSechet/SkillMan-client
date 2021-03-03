import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Cookies from 'react-cookies'

import './style/App.css';

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },
});

export default function Nav({ handleCloseProjectList }) {

    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [listAvailableProject, setListAvailableProject] = useState(
        [
            {
                "_id": "",
                "name": "",
                "description": "",
                "accessToken": false,
                "url": "",
                "param": [
                    {
                        "name": "",
                        "type": ""
                    }
                ],
                "__v": 0
            }
        ]
    );
    const [projectParam, setProjectParam] = useState(
        [
            {
                "value": "",
                "type": ""
            },
            {
                "value": "",
                "type": ""
            }
        ]
    );
    const [projectTemplate, setProjectTemplate] = useState(
        {
            "_id": "",
            "name": "",
            "description": "",
            "accessToken": false,
            "url": "",
            "param": [
                {
                    "name": "",
                    "type": ""
                }
            ],
            "__v": 0
        }
    );


    const anchorRef = useRef(null);
    const classes = useStyles();

    useEffect(() => {
        // Gets the list of projects
    }, []);

    const handleAddProjectButton = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }

    const handleClickOpenDialog = (chosenProjectTemplate) => {
        setProjectTemplate(chosenProjectTemplate);
        setOpenDialog(true);
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
        handleCloseProjectList();
    };

    const handleAddProject = () => {

        let projectValue = [

        ];

        console.log('projectParam', projectParam);

        switch (projectTemplate.name) {
            case 'Weather':
                projectParam !== undefined && projectParam[0] && projectParam[0].value !== "" ?
                    projectValue = [{ value: projectParam[0].value }] :
                    projectValue = [{ value: "Berlin" }];
                break;
            case 'Pokemon Information':
                projectParam !== undefined && projectParam[0] && projectParam[0].value !== "" ?
                    projectValue = [{ value: projectParam[0].value }] :
                    projectValue = [{ value: "pikachu" }];
                break;
            case 'Random food':
                projectParam !== undefined && projectParam[0] && projectParam[0].value !== "" ?
                    projectValue = [{ value: projectParam[0].value }] :
                    projectValue = [{ value: "burger" }];
                break;
            case 'Job research':
                projectParam !== undefined && projectParam[0] && projectParam[0].value !== "" ?
                    projectValue = [{ value: projectParam[0].value }, { value: projectParam[1].value }] :
                    projectValue = [{ value: "machine learning" }, { value: "London" }];
                break;
            case 'Spotify user playlist':
                projectParam !== undefined && projectParam[0] && projectParam[0].value !== "" ?
                    projectValue = [{ value: projectParam[0].value }] :
                    projectValue = [{ value: "arnaud.roncaripro" }];
                break;
            case 'Random cat':
                projectValue = [];
                break;
            default: break;
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + Cookies.load('accessToken')
            },
            body: JSON.stringify({
                template_id: projectTemplate._id,
                param: projectValue
            })
        }
        console.log('requestOptions body:', requestOptions.body);

        fetch('http://localhost:8080/project/add', requestOptions)
            .then(async res => {
                const data = await res.json();

                if (res.ok === false) {
                    const error = (data && data.error) || res.status;
                    return Promise.reject(error);
                }
            })
            .catch((err) => {
                console.error('Could not add project:', err.toString());
            });
    }

    const navStyle = {
        color: 'white',
        textDecoration: 'none'
    }

    return (
        <div>
            <nav>
                <Button
                    ref={anchorRef}
                    aria-controls={open ? 'menu-list-grow' : undefined}
                    aria-haspopup="true"
                    onClick={handleAddProjectButton}
                    variant="contained"
                    color="primary"
                    className={classes.addButton}
                    startIcon={<AddIcon />}
                >
                    Add Project
                </Button>

                <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal style={{ zIndex: 10 }}>
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={
                                    (e) => {
                                        handleClose(e);
                                        handleCloseProjectList();
                                    }}>
                                    <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>

                                        {listAvailableProject.map((elem) => {
                                            return <MenuItem key={elem._id} onClick={
                                                () => {
                                                    handleClickOpenDialog(elem)
                                                }
                                            }>{elem.name}</MenuItem>
                                        })}

                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>

                <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Values</DialogTitle>
                    <DialogContent>
                        <DialogContentText >
                            You can enter prefered values. Otherwise default values will be entered for you.
                        </DialogContentText>
                        {projectTemplate.param.map((elem, ite) => {
                            return <TextField
                                key={ite}
                                autoFocus
                                margin="dense"
                                id="name"
                                label={elem.name}
                                type="name"
                                fullWidth
                                onChange={(elem) => {
                                    let newProjectParam = [...projectParam];
                                    newProjectParam[ite].value = elem.target.value;
                                    setProjectParam(newProjectParam);
                                    console.log('newProjectParam:', newProjectParam);
                                }}
                            />
                        })}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">
                            Cancel
                    </Button>
                        <Button onClick={
                            (e) => {
                                handleAddProject();
                                handleCloseDialog(e)
                                handleCloseProjectList();
                            }
                        } color="primary">
                            Create Project
                    </Button>
                    </DialogActions>
                </Dialog>

                <ul className="nav-links">
                    <Button variant="contained" color="primary" onClick={
                        () => {
                            Cookies.remove('userID');
                            Cookies.remove('accessToken');
                            Cookies.remove('G_accessToken');
                        }
                    }>
                        <Link style={navStyle} to="/">
                            <li>Logout</li>
                        </Link>
                    </Button>
                </ul>
            </nav>
        </div>
    )
}