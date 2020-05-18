import { useState, useEffect, useCallback, useMemo } from "react"
import { fetchDocument, describeDocument } from "plandoc"
import { useWebId } from "@solid/react"
import { Cult, Passport, Notification, Profile, useModel, wwwCultWebId } from "./model"

export function useDocument(virtualDocument){
  const [document, setDocument] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  useEffect(() => {
    async function loadDocument(){
      setLoading(true)
      try {
        setDocument(await fetchDocument(virtualDocument))
      } catch (e) {
        setError(e)
      }
      setLoading(false)
    }
    if (virtualDocument) loadDocument()
  }, [virtualDocument])

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

export function useCult(cultDocument){
  const [cultDoc, save, loading, error] = useDocument(cultDocument)
  const cult = useMemo(
    () => cultDoc && new Cult(cultDoc, save),
    [cultDoc, save]
  )
  return [ cult, loading, error ]
}

export function useCultByRef(cultRef) {
  const [document, setDocument] = useState()
  useEffect(() => {
    if (cultRef){
      setDocument(describeDocument().isFoundAt(cultRef))
    }
  }, [cultRef])
  return useCult(document)
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
