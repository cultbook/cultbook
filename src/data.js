import { useState, useEffect, useCallback, useMemo } from "react"
import { fetchDocument, describeDocument } from "plandoc"
import { useWebId } from "@solid/react"

import { Ritual, Cult, Passport, Notification, Profile, useModel, wwwCultWebId, privateCultDocument } from "./model"
import useLatestUpdate from "./hooks/useLatestUpdate"

export function useDocument(virtualDocument){
  const [document, setDocument] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [needsRefresh, setNeedsRefresh] = useState(false)
  const { timestamp } = useLatestUpdate(document)
  useEffect(() => {
    async function loadDocument(){
      setLoading(true)
      try {
        setDocument(await fetchDocument(virtualDocument))

      } catch (e) {
        console.error("error fetching document", e)
        setError(e)
      }
      setLoading(false)
    }
    if (needsRefresh) {
      virtualDocument.promise = undefined
      setNeedsRefresh(false)
    }
    if (virtualDocument) loadDocument()
  }, [virtualDocument, needsRefresh])

  useEffect(() => {
    if (timestamp){
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
  return [ cult, loading || loadingPrivate, [error, errorPrivate]]
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

export function useRitual(virtualRitualDocument, ritualRef){
  const [ritualDocument, save, loading, error] = useDocument(virtualRitualDocument)
  const ritual = useMemo(
    () => ritualDocument && new Ritual(ritualDocument, ritualDocument.getSubject(ritualRef), save),
    [ritualDocument, ritualRef, save]
  )
  return [ritual, loading, error]
}

export function useRitualByRef(ritualRef) {
  const [document, setDocument] = useState()
  useEffect(() => {
    if (ritualRef){
      const virtualDocument = describeDocument().isFoundAt(ritualRef)
      setDocument(virtualDocument)
    }
  }, [ritualRef])
  return useRitual(document, ritualRef)
}

export function usePassport(passportDocument){
  const [ passportDoc, save, loading, error ] = useDocument(passportDocument)
  const passport = useMemo(
    () => passportDoc && new Passport(passportDoc, save),
    [passportDoc, save]
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
  const notificationDocument = useMemo(() => uri && describeDocument().isFoundAt(uri), [uri])
  const [ notificationDoc, save, loading, error ] = useDocument(notificationDocument)
  const notification = notificationDoc && new Notification(notificationDoc, save)
  return [notification, loading, error]
}

export function useProfile(profileDocument) {
  const [ profileDoc, save, loading, error ] = useDocument(profileDocument)
  const profile = profileDoc && new Profile(profileDoc, save)
  return [profile, loading, error]
}

export function useProfileByWebId(uri){
  const profileDocument = useMemo(() => uri && describeDocument().isFoundAt(uri), [uri])
  return useProfile(profileDocument)
}
