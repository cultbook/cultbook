import { useState, useEffect } from "react"
import { fetchDocument } from "plandoc"

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
  return [document, loading, error]
}
