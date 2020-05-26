import React from 'react'

import Button from "./Button"
import { useAuthContext } from "../context/auth"

export default function LoginButton(){
  const { popupLogIn } = useAuthContext()
  async function login(){
    await popupLogIn()
  }
  return (
    <Button onClick={login}>
      Invoke The Spell of Identification
    </Button>
  )
}
