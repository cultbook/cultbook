import { useState, useEffect } from "react"
import { describeSubject, describeDocument, describeContainer} from "plandoc"
import { space, solid, rdf } from "rdf-namespaces";


const Cult = "https://thecultbook.com/ontology#Cult"
const Passport = "https://thecultbook.com/ontology#Passport"

export function useModel(webId){
  const [profileDocument, setProfileDocument] = useState()
  const [cultDocument, setCultDocument] = useState()
  const [passportDocument, setPassportDocument] = useState()
  useEffect(() => {
    if (webId){
      const profileDoc = describeDocument().isFoundAt(webId)
      setProfileDocument(profileDoc)

      const profileSubject = describeSubject().isFoundAt(webId)

      const storage = describeContainer()
            .isFoundOn(profileSubject, space.storage);
      const publicStorage = describeContainer().experimental_isContainedIn(storage, "public")
      const privateStorage = describeContainer().experimental_isContainedIn(storage, "private")

      const publicTypeIndex = describeDocument()
            .isFoundOn(profileSubject, solid.publicTypeIndex)

      const cultPublicTypeRegistration = describeSubject()
            .isEnsuredIn(publicTypeIndex)
            .withRef(rdf.type, solid.TypeRegistration)
            .withRef(solid.forClass, Cult)
      const cultDoc = describeDocument()
            .isEnsuredOn(cultPublicTypeRegistration, solid.instance, publicStorage)
      setCultDocument(cultDoc)

      const passportPublicTypeRegistration = describeSubject()
            .isEnsuredIn(publicTypeIndex)
            .withRef(rdf.type, solid.TypeRegistration)
            .withRef(solid.forClass, Passport)
      const passportDoc = describeDocument()
            .isEnsuredOn(passportPublicTypeRegistration, solid.instance, publicStorage)
      setPassportDocument(passportDoc)
    }
  }, [webId])
  return { profileDocument, cultDocument, passportDocument }
}
