import { useState, useEffect, useCallback, useMemo } from "react"
import { fetchDocument, describeDocument } from "plandoc"
import { useWebId } from "@solid/react"
import { ldp } from 'rdf-namespaces'
import * as td from "tripledoc"

import { Ritual, Cult, Passport, Performance, Notification, Profile, useModel, privateCultDocument, cultDocumentFromWebId } from "./model"
import { wwwCultWebId } from "./constants"
import useLatestUpdate from "./hooks/useLatestUpdate"
import { deleteDocument, documentExists } from "./services"
import { loadImage } from "./utils/fetch"

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
        if (needsRefresh){
          virtualDocument.promise = td.fetchDocument(document.asRef())
          setNeedsRefresh(false)
        }
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

export function useCultByWebId(webId) {
  const [document, setDocument] = useState()
  const [privateDocument, setPrivateDocument] = useState()
    useEffect(() => {
    if (webId){
      const [virtualDoc, privateVirtualDoc] = cultDocumentFromWebId(webId)
      setDocument(virtualDoc)
      setPrivateDocument(privateVirtualDoc)
    }
  }, [webId])
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

export function usePerformance(uri){
  const performanceDocument = useMemo(() => uri && describeDocument().isFoundAt(uri), [uri])
  const [ performanceDoc, save, loading, error ] = useDocument(performanceDocument)
  const performance = useMemo(() => performanceDoc && new Performance(performanceDoc, save), [performanceDoc, save])
  return [performance, loading, error]
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

export function useDocumentExists(uri){
  const [exists, setExists] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const checkExists = useCallback(async function checkExists(){
    try {
      setLoading(true)
      setExists(await documentExists(uri))
      setLoading(false)
    } catch (e) {
      setError(e)
    }
  }, [uri])
  useEffect(() => {
    if (uri){
      checkExists()
    }
  }, [uri, checkExists])
  return [exists, loading, error, checkExists]
}

export function useImage(imageUri){
  const [imageSrc, setImageSrc] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  useEffect(() => {
    if (imageUri){
      async function loadImageFromUri(){
        setLoading(true)
        try {
          setImageSrc(await loadImage(imageUri))
        } catch (e) {
          setError(e)
        }
        setLoading(false)
      }
      loadImageFromUri()
    }
  }, [imageUri])
  const deleteImage = useCallback(async () => {
    await deleteDocument(imageUri)
    setImageSrc(null)
  }, [imageUri])
  return [imageSrc, loading, error, deleteImage]
}

export function useRules(passport){
  const [rules, setRules] = useState()
  const [loading, setLoading] = useState()
  const [error, setError] = useState()
  useEffect(() => {
    if (passport){
      async function loadRules(){
        setLoading(true)
        try {
          setRules(await passport.getRules())
        } catch (e) {
          setError(e)
        }
        setLoading(false)
      }
      loadRules()
    }
  }, [passport])
  return [rules, loading, error]
}

export function useGatherings(passport){
  const [gatherings, setGatherings] = useState()
  const [loading, setLoading] = useState()
  const [error, setError] = useState()
  useEffect(() => {
    if (passport){
      async function loadGatherings(){
        setLoading(true)
        try {
          setGatherings(await passport.getGatherings())
        } catch (e) {
          setError(e)
        }
        setLoading(false)
      }
      loadGatherings()
    }
  }, [passport])
  return [gatherings, loading, error]
}
