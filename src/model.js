import { useState, useEffect } from "react"
import { describeSubject, describeDocument, describeContainer} from "plandoc"
import { space, solid, rdf } from "rdf-namespaces";


const Cult = "https://thecultbook.com/ontology#Cult"

export function useModel(webId){
  const [profile, setProfile] = useState()
  const [privateCult, setPrivateCult] = useState()
  const [publicCult, setPublicCult] = useState()
  useEffect(() => {
    if (webId){
      const profileDocument = describeDocument().isFoundAt(webId)
      const profileSubject = describeSubject().isFoundAt(webId)
      const storage = describeContainer()
            .isFoundOn(profileSubject, space.storage);

      const privateTypeIndex = describeDocument()
            .isFoundOn(profileSubject, solid.privateTypeIndex)
      const cultPrivateTypeRegistration = describeSubject()
            .isEnsuredIn(privateTypeIndex)
            .withRef(rdf.type, solid.TypeRegistration)
            .withRef(solid.forClass, Cult)
      const cultPrivateStorage = describeContainer().experimental_isContainedIn(storage, "private/cultbook")
      const cultPrivateDocument = describeDocument()
            .isEnsuredOn(cultPrivateTypeRegistration, solid.instance, cultPrivateStorage)

      const publicTypeIndex = describeDocument()
            .isFoundOn(profileSubject, solid.publicTypeIndex)
      const cultPublicTypeRegistration = describeSubject()
            .isEnsuredIn(publicTypeIndex)
            .withRef(rdf.type, solid.TypeRegistration)
            .withRef(solid.forClass, Cult)
      const cultPublicStorage = describeContainer().experimental_isContainedIn(storage, "public/cultbook")
      const cultPublicDocument = describeDocument()
            .isEnsuredOn(cultPublicTypeRegistration, solid.instance, cultPublicStorage)

      setProfile(profileDocument)
      setPrivateCult(cultPrivateDocument)
      setPublicCult(cultPublicDocument)

    }
  }, [webId])
  return { profile, privateCult, publicCult }
}
