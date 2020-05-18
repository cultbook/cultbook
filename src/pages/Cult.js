import React from 'react'

import { useParams } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useWebId } from "@solid/react"

import DefaultLayout from "../layouts/Default"
import { useCultByRef, useCurrentUserIsWWWCult, usePassport } from "../data"
import { useModel } from "../model"

const useStyles = makeStyles(theme => ({
}))


export function CultPageByEncodedRef() {
  const { encodedCultRef } = useParams()
  return (
    <CultPage cultRef={decodeURIComponent(encodedCultRef)} />
  )
}

function CultBookmarker({cult}){
  const webId = useWebId()
  const { passportDocument } = useModel(webId)
  const [passport] = usePassport(passportDocument)
  const bookmarkCult = () => {
    passport.addKnown(cult.asRef())
    passport.save()
  }
  return <Button onClick={bookmarkCult}>Bookmark</Button>
}


export default function CultPage({cultRef}){
  const classes = useStyles();
  const [cult] = useCultByRef(cultRef)
  const currentUserIsWWWCult = useCurrentUserIsWWWCult()
  return (
    <DefaultLayout>
      <h1>{cult && cult.name}</h1>
      {currentUserIsWWWCult && <CultBookmarker cult={cult}/>}
    </DefaultLayout>
  )
}
