import React from 'react'

import Button from '@material-ui/core/Button';

import Link from "../components/Link"

const ButtonLink = ({size, ...props}) => {
  const fontSize = size === 'large' ? '1.333rem' : null;
  return <Button component={Link} style={{color: 'inherit', fontSize, textDecoration: 'inherit'}} {...props} />
}

export default ButtonLink;
