import React from 'react'
import Typography from '@material-ui/core/Typography';
import Nav from './Nav.js';

export default function Home() {

    return (
        <div>
            <Nav />
            <Typography variant="h1" component="h2" gutterBottom >
                Your projects
            </Typography>
        </div>
    )
}