import React from 'react'

import Button from "./Button"
import { useAuthContext } from "../context/auth"

export default function LoginButton(){
  const { logIn } = useAuthContext()
  async function login(){
    await logIn()
  }
  return (
    <Button onClick={login}>
      Join Us
    </Button>
  )
}
