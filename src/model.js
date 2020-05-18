import { useState, useEffect } from "react"
import { describeSubject, describeDocument, describeContainer} from "plandoc"
import { space, solid, rdf, rdfs, ldp, vcard } from "rdf-namespaces"

const prefix = "https://thecultbook.com/ontology#"

export const cb = {
  Cult: `${prefix}Cult`,
  Passport: `${prefix}Passport`,
  follows: `${prefix}follows`,
  convening: `${prefix}convening`,
  demands: `${prefix}demands`
}

export class Rule {
  constructor(document, subject, save) {
    this.document = document
    this.subject = subject
    this.save = save
  }

  asRef() {
    return this.subject.asRef()
  }

  get name() {
    return this.subject.getString(rdfs.label)
  }

  set name(newName) {
    this.subject.setString(rdfs.label, newName)
  }

  get description() {
    return this.subject.getString(rdfs.comment)
  }

  set description(newComment) {
    this.subject.setString(rdfs.comment, newComment)
  }
}

export class Ritual {
  constructor(document, subject, save) {
    this.document = document
    this.subject = subject
    this.save = save
  }

  asRef() {
    return this.subject.asRef()
  }

  get name() {
    return this.subject.getString(rdfs.label)
  }

  set name(newName) {
    this.subject.setString(rdfs.label, newName)
  }

  get description() {
    return this.subject.getString(rdfs.comment)
  }

  set description(newComment) {
    this.subject.setString(rdfs.comment, newComment)
  }
}

export class Cult {
  constructor(document, save) {
    this.document = document
    this.subject = document.getSubject(`${document.asRef()}#cult`)
    this.save = save
  }

  get name() {
    return this.subject.getString(rdfs.label)
  }

  set name(newName) {
    this.subject.setString(rdfs.label, newName)
  }

  get description() {
    return this.subject.getString(rdfs.comment)
  }

  set description(newComment) {
    this.subject.setString(rdfs.comment, newComment)
  }

  get followers() {
    return this.subject.getAllRefs(vcard.hasMember)
  }

  removeFollower(followerWebId) {
    this.subject.removeRef(vcard.hasMember, followerWebId)
  }

  addFollower(followerWebId) {
    this.subject.addRef(vcard.hasMember, followerWebId)
  }

  get convening() {
    return this.subject.getAllRefs(cb.convening)
  }

  get rituals() {
    return this.subject.getAllRefs(cb.convening).map(
      ritualRef => new Ritual(this.document, this.document.getSubject(ritualRef), this.save)
    )
  }

  removeRitual(ritual) {
    this.subject.removeRef(cb.convening, ritual.asRef())
    this.document.removeSubject(ritual.asRef())
  }

  addRitual(name, description) {
    const ritual = new Ritual(this.document, this.document.addSubject(), this.save)
    ritual.name = name
    ritual.description = description
    this.subject.addRef(cb.convening, ritual.asRef())
  }

  get rules() {
    return this.subject.getAllRefs(cb.demands).map(
      ruleRef => new Rule(this.document, this.document.getSubject(ruleRef), this.save)
    )
  }

  removeRule(rule) {
    this.subject.removeRef(cb.demands, rule.asRef())
    this.document.removeSubject(rule.asRef())
  }

  addRule(name, description) {
    const rule = new Rule(this.document, this.document.addSubject(), this.save)
    rule.name = name
    rule.description = description
    this.subject.addRef(cb.demands, rule.asRef())
  }

  asRef() {
    return this.subject.asRef()
  }
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
