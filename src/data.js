import { useState, useEffect, useCallback, useMemo } from "react"
import { fetchDocument, describeDocument } from "plandoc"
import { useWebId } from "@solid/react"
import { rdfs } from "rdf-namespaces"

import { Cult, Passport, Notification, Profile, useModel, wwwCultWebId, privateCultDocument } from "./model"
import useLatestUpdate from "./hooks/useLatestUpdate"

export function useDocument(virtualDocument){
  const [document, setDocument] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [needsRefresh, setNeedsRefresh] = useState(false)
  const { timestamp } = useLatestUpdate(document)
  useEffect(() => {
    async function loadDocument(){
      setNeedsRefresh(false)
      setLoading(true)
      try {
        setDocument(await fetchDocument(virtualDocument))

      } catch (e) {
        console.error("error fetching document", e)
        setError(e)
      }
      setLoading(false)
    }
    if (virtualDocument) loadDocument()
  }, [virtualDocument, needsRefresh])

  useEffect(() => {
    if (timestamp){
      virtualDocument.promise = undefined
      setNeedsRefresh(true)
    }
  }, [timestamp])

  const saveDocument = useCallback(async () => {
    try {
      const savedDocument = await document.save()
      setDocument(savedDocument)
      return savedDocument
    } catch (e) {
      setError(e)
      return null
    }
  }, [document])
  return [document, saveDocument, loading, error]
}

export function useCult(cultVirtualDoc, cultPrivateVirtualDoc){
  const [cultDoc, savePublic, loading, error] = useDocument(cultVirtualDoc)
  const [privateCultDoc, savePrivate, loadingPrivate, errorPrivate] = useDocument(cultPrivateVirtualDoc)
  const save = useCallback(
    () => Promise.all([savePublic(), savePrivate()]),
    [savePublic, savePrivate]
  )
  const cult = useMemo(
    // if we get errors loading the private doc, just load it up with the public doc
    () => cultDoc && (privateCultDoc || errorPrivate) && new Cult(cultDoc, privateCultDoc, save),
    [cultDoc, privateCultDoc, errorPrivate, save]
  )
  return [ cult, loading, error ]
}

export function useCultByRef(cultRef) {
  const [document, setDocument] = useState()
  const [privateDocument, setPrivateDocument] = useState()
  useEffect(() => {
    if (cultRef){
      const virtualDocument = describeDocument().isFoundAt(cultRef)
      const virtualPrivateDocument = privateCultDocument(virtualDocument)
      setDocument(virtualDocument)
      setPrivateDocument(virtualPrivateDocument)
    }
  }, [cultRef])
  return useCult(document, privateDocument)
}

export function usePassport(passportDocument){
  const [ passportDoc, save, loading, error ] = useDocument(passportDocument)
  const passport = useMemo(
    () => passportDoc && new Passport(passportDoc, save),
    [passportDoc]
  )
  return [ passport, loading, error ]
}

export function useCurrentUserIsWWWCult(){
  const webId = useWebId()
  return webId === undefined ? undefined : (webId === wwwCultWebId)
}

export function useKnownCults(){
  const { passportDocument } = useModel(wwwCultWebId)
  const [ passport, loading, error ] = usePassport(passportDocument)
  return [passport && passport.known, loading, error]
}

export function useNotification(uri){
  const notificationDocument = useMemo(() => describeDocument().isFoundAt(uri), [uri])
  const [ notificationDoc, save, loading, error ] = useDocument(notificationDocument)
  const notification = notificationDoc && new Notification(notificationDoc)
  return [notification, loading, error]
}

export function useProfileByWebId(uri){
  const profileDocument = useMemo(() => describeDocument().isFoundAt(uri), [uri])
  const [ profileDoc, save, loading, error ] = useDocument(profileDocument)
  const profile = profileDoc && new Profile(profileDoc)
  return [profile, loading, error]
}
