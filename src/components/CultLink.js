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
        <ButtonLink size='large' to={urls.cult(cult)} {...props}><span style={{color:'#DC143C'}}>{cult && cult.name}</span></ButtonLink>
      )}
    </>
  )
}
