import React from 'react'

import { makeStyles } from '@material-ui/core/styles';

import DefaultLayout from "../layouts/Default"

const useStyles = makeStyles(theme => ({
}))

export default function CultPage(){
  const classes = useStyles();
  return (
    <DefaultLayout>
      info about a cult
    </DefaultLayout>
  )
}
