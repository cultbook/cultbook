import React from 'react'

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { rdfs, foaf, vcard, ldp } from 'rdf-namespaces'

import { useDocument, useCult, usePassport } from "../data"
import { useModel, cb, Cult, Rule, Ritual } from "../model"
import Notification from "../components/Notification"
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
