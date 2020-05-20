import React from 'react'

import Button from '@material-ui/core/Button';
import { useWebId } from "@solid/react"

import Link from "./Link"

export default function MyCultLink({cult}){
  const webId = useWebId()
  const startCult = async () => {
    await cult.create(webId)
  }
  return (
    <>
      {cult && cult.created ? (
        <Link to="/me/cult">My Cult</Link>
      ) : (
        <Button onClick={startCult}>Start a Cult</Button>
      )}
    </>
  )
}
