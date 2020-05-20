import React from 'react'

import Button from '@material-ui/core/Button';
import { useWebId } from "@solid/react"

import ButtonLink from "./ButtonLink"

export default function MyCultLink({cult, myCultText="Attend to My Cult"}){
  const webId = useWebId()
  const startCult = async () => {
    await cult.create(webId)
  }
  return (
    <>
      {cult && cult.created ? (
        <ButtonLink to="/me/cult">{myCultText}</ButtonLink>
      ) : (
        <Button onClick={startCult}>Start a Cult</Button>
      )}
    </>
  )
}
