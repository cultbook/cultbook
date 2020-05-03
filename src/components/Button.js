import React from 'react';

import MuiButton from "@material-ui/core/Button"
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
}))

export default function Button(props){
  const classes = useStyles()
  return <MuiButton className={classes.button} {...props}/>
}
