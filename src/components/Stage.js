import React from 'react'

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
  centeredOuter: {
    position: 'relative',
    height: '90vh',
  },
  centeredInner: {
    position: 'relative',
    transform: 'translateY(-50%)',
    top: '50%',
  },
}))

const Stage = ({children}) => {
  const classes = useStyles();

  return(<Grid item xs={12} className={classes.centeredOuter}>
    <Grid container className={classes.centeredInner}>
      {children}
    </Grid>
  </Grid>);
}

export default Stage;
