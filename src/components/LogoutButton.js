import React from 'react'

import Button from "./Button"
import { useAuthContext } from "../context/auth"
import MenuItem from '@material-ui/core/MenuItem';

export default function LogoutButton(){
  const { logOut } = useAuthContext()
  return (
    <Button onClick={logOut}>
      Leave Us
    </Button>
  )
}

export function LogoutMenuItem(){
  const { logOut } = useAuthContext()
  return (
    <MenuItem onClick={logOut}>
      Leave Us
    </MenuItem>
  )
}
