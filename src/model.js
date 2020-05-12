import { useState, useEffect } from "react"
import { describeSubject, describeDocument, describeContainer} from "plandoc"
import { space, solid, rdf } from "rdf-namespaces";


const Cult = "https://thecultbook.com/ontology#Cult"

export function useModel(webId){
  const [profileDocument, setProfileDocument] = useState()
  const [cultDocument, setCultDocument] = useState()
  useEffect(() => {
    if (webId){
      const profileDoc = describeDocument().isFoundAt(webId)
      const profileSubject = describeSubject().isFoundAt(webId)
      const storage = describeContainer()
            .isFoundOn(profileSubject, space.storage);

      const publicTypeIndex = describeDocument()
            .isFoundOn(profileSubject, solid.publicTypeIndex)
      const cultPublicTypeRegistration = describeSubject()
            .isEnsuredIn(publicTypeIndex)
            .withRef(rdf.type, solid.TypeRegistration)
            .withRef(solid.forClass, Cult)
      const cultDoc = describeDocument()
            .isEnsuredOn(cultPublicTypeRegistration, solid.instance, storage)

      setProfileDocument(profileDoc)
      setCultDocument(cultDoc)

    }
  }, [webId])
  return { profileDocument, cultDocument }
}
