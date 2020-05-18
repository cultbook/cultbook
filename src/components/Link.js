import React, { forwardRef } from 'react'
import { Link as RouterLink } from "react-router-dom";
import MuiLink from '@material-ui/core/Link';

const Link = forwardRef((props, ref) => {
  if (props.href) {
    return <MuiLink ref={ref} {...props} />
  } else {
    return <MuiLink ref={ref} component={RouterLink} {...props} />
  }
})

export default Link
