import React from 'react'

import { makeStyles } from '@material-ui/core/styles';

import DefaultLayout from "../layouts/Default"

const useStyles = makeStyles(theme => ({
}))

export default function MePage(){
  const classes = useStyles();
  return (
    <DefaultLayout>
      info about me
    </DefaultLayout>
  )
}
