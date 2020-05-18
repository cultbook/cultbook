import { useState, useEffect, useCallback, useMemo } from "react"
import { fetchDocument, describeDocument } from "plandoc"

import { Cult } from "./model"

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
    () => passportDoc && passportDoc.getSubject(`${passportDoc.asRef()}#passport`),
    [passportDoc]
  )
  return [ passport, save, loading, error ]
}
