import React from 'react'

import { makeStyles } from '@material-ui/core/styles';

import LoginButton from "../components/LoginButton"

const useStyles = makeStyles(theme => ({
  logo: {
    fontFamily: "gothicus, serif",
    color: "#ac5858",
    marginTop: 0,
    marginBottom: 0,
    fontSize: "33vw"
  }
}))

export default function LandingPage(){
  const classes = useStyles();
  return (
    <header className="App-header">
      <h1 className={classes.logo}>cultbook</h1>
      <LoginButton/>
    </header>
  )
}
