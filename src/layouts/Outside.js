import React from 'react'

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  logo: {
    fontFamily: "gothicus, serif",
    color: "#ac5858",
    marginTop: 0,
    marginBottom: 0,
    fontSize: "13vw"
  },
}))

export default function OutsideLayout({children}){
  const classes = useStyles();
  return (
    <header className="App-header">
      <h1 className={classes.logo}>cultbook</h1>
      {children}
    </header>
  )
}
