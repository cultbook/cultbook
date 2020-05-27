import React from 'react'

import { useWebId } from "@solid/react"

import Link from "./Link"
import ButtonLink from "./ButtonLink"
import NamePrompt from "./NamePrompt"
import { useCultByRef } from "../data"
import * as urls from "../urls"

export default function CultLink({cultRef, ...props}){
  const [cult] = useCultByRef(cultRef)
  return (
    <>
      {cult && (
        <Link to={urls.cult(cult)} {...props}>{cult && cult.name}</Link>
      )}
    </>
  )
}
