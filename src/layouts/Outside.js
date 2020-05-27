import React from 'react'

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

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
    <Box>
      <header className="App-header">
        <h1 className={classes.logo}>cultbook</h1>
      </header>
      {children}
    </Box>
  )
}
