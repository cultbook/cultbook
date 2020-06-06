import React from 'react'

import Link from "./Link"
import Loader from "./Loader"
import { useProfileByWebId } from "../data"
import * as urls  from "../urls"

export default function ProfileLink({webId, size}){
  const [profile] = useProfileByWebId(webId)

  const fontSize = size === 'large' ? '1.333rem' : null;

  return profile ? (
    <Link style={{fontSize}} to={urls.profileByRef(profile.asRef())}>{profile.name || "an unnamed soul"}</Link>
  ) : (
    <Loader/>
  )
}
