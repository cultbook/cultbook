import React from "react"
import Loader from 'react-loader-spinner'
import { useTheme } from '@material-ui/core/styles';

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"


export default ({size="med"}) => {
  const theme = useTheme()
  const pxSize = (size === "sm") ? theme.spacing(3) : theme.spacing(6)
  return (<Loader type="BallTriangle" color={theme.palette.primary.dark} height={pxSize} width={pxSize}/>)
}
