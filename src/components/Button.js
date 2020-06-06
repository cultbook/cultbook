import React from 'react';

import MuiButton from "@material-ui/core/Button"
import { makeStyles } from '@material-ui/core/styles';

const Button = ({size, ...props}) => {
  const fontSize = size === 'large' ? '1.333rem' : null;
  return <MuiButton style={{color: 'inherit', fontSize, textDecoration: 'inherit'}} {...props}/>
}

export default Button;
