import React from 'react'
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  scene: {
    maxWidth: "66vw",
    margin: "auto",
    fontSize: "1.666em"
  }
}))

export default function Scene(props){
  const classes = useStyles()
  return (
    <Typography variant="body1" className={classes.scene} {...props}/>
  )
}
