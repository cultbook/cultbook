import React, { useState, useEffect } from "react"
import { fetchDocument, describeSubject, describeDocument } from "plandoc"

import { useModel } from "./model"

export function useDocument(virtualDocument){
  const [document, setDocument] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  useEffect(() => {
    async function loadDocument(){
      setLoading(true)
      setDocument(await fetchDocument(virtualDocument))
      setLoading(false)
    }
    if (virtualDocument) loadDocument()
  }, [virtualDocument])
  return [document, loading, error]
}
