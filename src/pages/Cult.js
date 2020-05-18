import React from 'react'

import { useParams } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

import DefaultLayout from "../layouts/Default"
import { useCultByRef } from "../data"

const useStyles = makeStyles(theme => ({
}))


export function CultPageByEncodedRef() {
  const { encodedCultRef } = useParams()
  return (
    <CultPage cultRef={decodeURIComponent(encodedCultRef)} />
  )
}

export default function CultPage({cultRef}){
  const classes = useStyles();
  const [cult] = useCultByRef(cultRef)
  return (
    <DefaultLayout>
      <h1>{cult && cult.name}</h1>
    </DefaultLayout>
  )
}
