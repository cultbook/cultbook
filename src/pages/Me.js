import React from 'react'

import { makeStyles } from '@material-ui/core/styles';
import { useWebId } from "@solid/react"

import DefaultLayout from "../layouts/Default"
import { useModel } from "../model"
import { useCult } from "../data"
import MyCultLink from "../components/Link"

const useStyles = makeStyles(theme => ({
}))

export default function MePage(){
  const classes = useStyles();
  const webId = useWebId()
  const { cultDocument, cultPrivateDocument } = useModel(webId)
  const [ cult ] = useCult(cultDocument, cultPrivateDocument)
  return (
    <DefaultLayout>
      <MyCultLink cult={cult}/>
    </DefaultLayout>
  )
}
