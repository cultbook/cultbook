import React, { useState, useEffect } from "react"
import { fetchDocument, describeSubject, describeDocument } from "plandoc"

export function useModel(webId){
  const [profile, setProfile] = useState()
  useEffect(() => {
    if (webId) {
      const p = describeSubject().isFoundAt(webId)
      setProfile(p)
    }
  }, [webId])
  return { profile }
}
