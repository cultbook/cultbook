import React from 'react'

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
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
