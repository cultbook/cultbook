import { useState, useEffect } from "react"
import { describeSubject, describeDocument, describeContainer} from "plandoc"
import { space, solid, rdf, ldp } from "rdf-namespaces"

const prefix = "https://thecultbook.com/ontology#"

export const cb = {
  Cult: `${prefix}Cult`,
  Passport: `${prefix}Passport`,
  follows: `${prefix}follows`,
  convening: `${prefix}convening`,
  demands: `${prefix}demands`
}

export function useModel(webId){
  const [profileDocument, setProfileDocument] = useState()
  const [inboxContainer, setInboxContainer] = useState()
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

      const inbox = describeContainer().isFoundOn(profileSubject, ldp.inbox)
      setInboxContainer(inbox)


      const publicTypeIndex = describeDocument()
            .isFoundOn(profileSubject, solid.publicTypeIndex)

      const cultPublicTypeRegistration = describeSubject()
            .isEnsuredIn(publicTypeIndex)
            .withRef(rdf.type, solid.TypeRegistration)
            .withRef(solid.forClass, cb.Cult)
      const cultDoc = describeDocument()
            .isEnsuredOn(cultPublicTypeRegistration, solid.instance, publicStorage)
      setCultDocument(cultDoc)

      const passportPublicTypeRegistration = describeSubject()
            .isEnsuredIn(publicTypeIndex)
            .withRef(rdf.type, solid.TypeRegistration)
            .withRef(solid.forClass, cb.Passport)
      const passportDoc = describeDocument()
            .isEnsuredOn(passportPublicTypeRegistration, solid.instance, publicStorage)
      setPassportDocument(passportDoc)
    }
  }, [webId])
  return { profileDocument, cultDocument, passportDocument, inboxContainer }
}
