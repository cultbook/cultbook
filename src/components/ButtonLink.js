import React from 'react'

import Button from '@material-ui/core/Button';

import Link from "../components/Link"

export default (props) => (
  <Button component={Link} {...props} />
)
