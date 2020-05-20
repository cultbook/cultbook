import React from 'react'

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import AppBar from "../components/AppBar"


const useStyles = makeStyles(theme => ({
  root: {

  },
}))

export default function DefaultLayout({children}) {
  const classes = useStyles();
  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <AppBar/>
      </Grid>
      {children}
    </Grid>
  )
}
