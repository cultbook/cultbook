import React from 'react'

import Link from "./Link"
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
