import React from 'react'

import Button from "./Button"
import { useAuthContext } from "../context/auth"

export default function LogoutButton(){
  const { logOut } = useAuthContext()
  return (
    <Button onClick={logOut}>
      Leave Us
    </Button>
  )
}
