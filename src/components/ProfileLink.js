import React from 'react'

import Button from '@material-ui/core/Button';
import { useWebId } from "@solid/react"

import Link from "./Link"
import NamePrompt from "./NamePrompt"
import Loader from "./Loader"
import { useProfileByWebId } from "../data"
import * as urls  from "../urls"

export default function ProfileLink({webId}){
  const [profile] = useProfileByWebId(webId)

  return profile ? (
    <Link to={urls.profileByRef(profile.asRef())}>{profile.name}</Link>
  ) : (
    <Loader/>
  )
}
