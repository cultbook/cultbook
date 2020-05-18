import React, { FunctionComponent, forwardRef, Ref } from 'react'
import { Link as RouterLink, LinkProps as RouterLinkProps } from "react-router-dom";
import MuiLink, { LinkProps as MuiLinkProps } from '@material-ui/core/Link';

const Link = forwardRef((props, ref) => {
  if (props.href) {
    return <MuiLink ref={ref} {...props} />
  } else {
    return <MuiLink ref={ref} component={RouterLink} {...props} />
  }
})

export default Link
