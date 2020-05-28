import React from 'react'

import { useWebId } from "@solid/react"

import ButtonLink from "./ButtonLink"
import NamePrompt from "./NamePrompt"

export default function MyCultLink({cult, ...props}){
  const webId = useWebId()
  const startCult = async (name) => {
    await cult.create(webId, name)
  }
  return (
    <>
      {cult && cult.created ? (
        <ButtonLink to="/me/cult" {...props}>Attend to {cult && cult.name}</ButtonLink>
      ) : (
        <NamePrompt openPrompt="Start a Cult"
                    title="what shall we call your cult?"
                    prompt="you can change this later"
                    onSubmit={startCult}/>
      )}
    </>
  )
}
