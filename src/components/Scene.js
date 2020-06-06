import React from 'react'
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  scene: {
    maxWidth: "66vw",
    margin: "auto",
    fontSize: '1.666rem',
    textAlign: 'justify',
    marginBottom: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      fontSize: '2.666rem',
    },
  }
}))

export default function Scene(props){
  const classes = useStyles()
  return (
    <Typography variant="body1" className={classes.scene} {...props}/>
  )
}
