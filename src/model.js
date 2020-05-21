import { useState, useEffect } from "react"
import { describeSubject, describeDocument, describeContainer } from "plandoc"
import * as td from "tripledoc";
import { space, solid, rdf, rdfs, ldp, vcard, foaf, schema, cal, acl } from "rdf-namespaces"
import { v4 as uuid } from 'uuid';

import { as } from "./vocab"
import { postToInbox } from "./services"
import { createPrivateCultDocAcl, createRitualUploadFolderAcl } from "./utils/acl"


const prefix = "https://thecultbook.com/ontology#"

export const cb = {
  Cult: `${prefix}Cult`,
  Passport: `${prefix}Passport`,
  follows: `${prefix}follows`,
  convening: `${prefix}convening`,
  demands: `${prefix}demands`,
  prescribes: `${prefix}prescribes`,
  knowsAbout: `${prefix}knowsAbout`,
  veilRemoved: `${prefix}veilRemoved`,
  uploadFolder: `${prefix}uploadFolder`
}

//const wwwCultRoot = "https://cultofwww.solid.thecultbook.com"
const wwwCultRoot = "https://cultofwww.inrupt.net"
export const wwwCultWebId = `${wwwCultRoot}/profile/card#me`
export const wwwCultInbox = `${wwwCultRoot}/inbox`

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

  async ensureUploadFolder(ownerWebId){
    if (!this.uploadFolder){
      const newFolderName = `${this.document.asRef().split("/").slice(0, -1).join("/")}/${uuid()}/`
      await createRitualUploadFolderAcl(this.document.asRef(), newFolderName, ownerWebId)
      this.uploadFolder = newFolderName
    }
  }

  get uploadFolder(){
    return this.subject.getRef(cb.uploadFolder)
  }

  set uploadFolder(uploadFolderRef){
    this.subject.setRef(cb.uploadFolder, uploadFolderRef)
  }
}

export class Gathering {
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

  get location() {
    return this.subject.getString(schema.location)
  }

  set location(newLocation) {
    this.subject.setString(schema.location, newLocation)
  }

  get time() {
    return this.subject.getDateTime(cal.dtstart)
  }

  set time(newTime) {
    this.subject.setDateTime(cal.dtstart, newTime)
  }
}

export class Profile {
  constructor(document, save) {
    this.document = document
    this.subject = document.getSubject(`${document.asRef()}#me`)
    this.save = save
  }

  get name() {
    return this.subject.getString(vcard.fn)
  }

  set name(newName) {
    this.subject.setString(vcard.fn, newName)
    this.subject.setString(foaf.name, newName)
  }

  get inbox(){
    return this.subject.getRef(ldp.inbox)
  }

  get permissions(){
    const {protocol, hostname, port} = window.location
    const origin = `${protocol}//${hostname}${port ? `:${port}` : ""}`
    const trustedApps = this.subject.getAllLocalSubjects(acl.trustedApp)
    const thisAppPermissions = trustedApps.find(p => (p.getRef(acl.origin) === origin))
    return thisAppPermissions && thisAppPermissions.getAllRefs(acl.mode)
  }

  get hasControlPermission(){
    const perms = this.permissions
    return !!(perms && perms.find(p => (p === acl.Control)))
  }

  asRef() {
    return this.subject.asRef()
  }
}

export class Cult {
  constructor(document, privateDocument, save) {
    this.document = document
    this.subject = document.getSubject(`${document.asRef()}#cult`)
    this.privateDocument = privateDocument
    this.privateSubject = privateDocument && privateDocument.getSubject(`${privateDocument.asRef()}#cult`)
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

  get members() {
    return this.privateSubject && this.privateSubject.getAllRefs(vcard.hasMember)
  }

  hasMember(webId){
    new Set(this.members).has(webId)
  }

  removeMember(memberWebId) {
    this.privateSubject && this.privateSubject.removeRef(vcard.hasMember, memberWebId)
  }

  addMember(webId) {
    this.privateSubject && this.privateSubject.addRef(vcard.hasMember, webId)
  }

  get prescribes() {
    return this.privateSubject && this.privateSubject.getAllRefs(cb.prescribes)
  }

  get rituals() {
    return this.prescribes && this.prescribes.map(
      ritualRef => new Ritual(this.privateDocument, this.privateDocument.getSubject(ritualRef), this.save)
    )
  }

  async removeRitual(ritual) {
    if (this.privateDocument){
      this.privateSubject.removeRef(cb.prescribes, ritual.asRef())
      this.privateDocument.removeSubject(ritual.asRef())
      return await this.save()
    }
  }

  async addRitual(name, description) {
    if (this.privateDocument){
      const ritual = new Ritual(this.privateDocument, this.privateDocument.addSubject(), this.save)
      ritual.name = name
      ritual.description = description
      this.privateSubject.addRef(cb.prescribes, ritual.asRef())
      await ritual.ensureUploadFolder(this.ownerWebId)
      await this.save()
      return ritual
    }
  }

  get convening() {
    return this.privateSubject && this.privateSubject.getAllRefs(cb.convening)
  }

  get gatherings() {
    return this.convening && this.convening.map(
      gatheringRef => new Gathering(this.privateDocument, this.privateDocument.getSubject(gatheringRef), this.save)
    )
  }

  removeGathering(gathering) {
    if (this.privateDocument){
      this.privateSubject.removeRef(cb.convening, gathering.asRef())
      this.privateDocument.removeSubject(gathering.asRef())
    }
  }

  addGathering(name, description) {
    if (this.privateDocument){
      const gathering = new Gathering(this.privateDocument, this.privateDocument.addSubject(), this.save)
      gathering.name = name
      gathering.description = description
      this.privateSubject.addRef(cb.convening, gathering.asRef())
    }
  }

  get rules() {
    return this.privateSubject && this.privateSubject.getAllRefs(cb.demands).map(
      ruleRef => new Rule(this.privateDocument, this.privateDocument.getSubject(ruleRef), this.save)
    )
  }

  removeRule(rule) {
    if (this.privateDocument) {
      this.privateSubject.removeRef(cb.demands, rule.asRef())
      this.privateDocument.removeSubject(rule.asRef())
    }
  }

  addRule(name, description) {
    if (this.privateDocument){
      const rule = new Rule(this.privateDocument, this.privateDocument.addSubject(), this.save)
      rule.name = name
      rule.description = description
      this.privateSubject.addRef(cb.demands, rule.asRef())
    }
  }

  get ownerWebId(){
    return this.subject.getRef(foaf.maker)
  }

  set ownerWebId(webId){
    return this.subject.setRef(foaf.maker, webId)
  }

  get created(){
    return !!this.ownerWebId
  }

  async notifyCultOfWWWOfCreation(creator){
    await postToInbox(wwwCultInbox, `
@prefix inv: <>.
@prefix as: <https://www.w3.org/ns/activitystreams#>.
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.

inv: a as:Create;
    rdfs:label "Our power grows!";
    rdfs:comment "Another cult has been formed.";
    as:actor <${creator}>;
    as:object <${this.asRef()}>.
`)
  }

  async create(creator, name){
    this.ownerWebId = creator
    this.name = name
    const cultCreateResults = await Promise.all([
      this.save(),
      createPrivateCultDocAcl(this.privateDocument.asRef(), creator),
      this.notifyCultOfWWWOfCreation(creator)
    ])
  }

  async maybeFetchOwnerProfileDocument() {
    if (!this._ownerProfileDocument) {
      this._ownerProfileDocument = await td.fetchDocument(this.ownerWebId)
    }
    return this._ownerProfileDocument
  }

  async getOwner(){
    return new Profile(await this.maybeFetchOwnerProfileDocument())
  }

  async applyToJoin(followerWebId){
    const owner = await this.getOwner()
    await postToInbox(owner.inbox, `
@prefix inv: <>.
@prefix as: <https://www.w3.org/ns/activitystreams#>.
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.

inv: a as:Follow;
    rdfs:label "IS THERE ROOM FOR ONE MORE?";
    rdfs:comment "You have a new follower.";
    as:actor <${followerWebId}>;
    as:object <${this.asRef()}>.
`)
  }

  asRef() {
    return this.subject.asRef()
  }
}

export class Passport {
  constructor(document, save) {
    this.document = document
    this.subject = document.getSubject(`${document.asRef()}#passport`)
    this.save = save
  }

  asRef() {
    return this.subject.asRef()
  }

  get veilRemoved(){
    return (this.subject.getInteger(cb.veilRemoved) === 1)
  }

  set veilRemoved(bool){
    this.subject.setInteger(cb.veilRemoved, bool ? 1 : 0)
  }

  get known() {
    return this.subject.getAllRefs(cb.knowsAbout)
  }

  addKnown(cultRef) {
    this.subject.addRef(cb.knowsAbout, cultRef)
  }

  get following(){
    return this.subject.getAllRefs(cb.follows)
  }

  addFollowing(cultRef){
    this.subject.addRef(cb.follows, cultRef)
  }

  removeFollowing(cultRef){
    this.subject.removeRef(cb.follows, cultRef)
  }
}

export class Notification {
  constructor(document, save) {
    this.document = document
    this.subject = document.getSubject(document.asRef())
    this.save = save
  }

  asRef() {
    return this.subject.asRef()
  }

  get name(){
    return this.subject.getString(rdfs.label)
  }

  get description(){
    return this.subject.getString(rdfs.comment)
  }

  get object(){
    return this.subject.getRef(as.object)
  }

  get actor(){
    return this.subject.getRef(as.actor)
  }

  get type(){
    return this.subject.getRef(rdfs.type)
  }
}

export function privateCultDocument(publicCultVirtualDocument){
  const cultPrivateDocRegistration = describeSubject()
        .isFoundIn(publicCultVirtualDocument)
        .withRef(rdf.type, solid.TypeRegistration)
        .withRef(solid.forClass, cb.Cult)
  return describeDocument().isFoundOn(cultPrivateDocRegistration, rdfs.seeAlso)
}

export function useModel(webId){
  const [profileDocument, setProfileDocument] = useState()
  const [inboxContainer, setInboxContainer] = useState()
  const [cultDocument, setCultDocument] = useState()
  const [cultPrivateDocument, setCultPrivateDocument] = useState()
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

      const cultPrivateDocRegistration = describeSubject()
            .isEnsuredIn(cultDoc)
            .withRef(rdf.type, solid.TypeRegistration)
            .withRef(solid.forClass, cb.Cult)
      const cultPrivateDoc = describeDocument()
            .isEnsuredOn(cultPrivateDocRegistration, rdfs.seeAlso, privateStorage)
      setCultPrivateDocument(cultPrivateDoc)

      const passportPublicTypeRegistration = describeSubject()
            .isEnsuredIn(publicTypeIndex)
            .withRef(rdf.type, solid.TypeRegistration)
            .withRef(solid.forClass, cb.Passport)
      const passportDoc = describeDocument()
            .isEnsuredOn(passportPublicTypeRegistration, solid.instance, publicStorage)
      setPassportDocument(passportDoc)
    }
  }, [webId])
  return { profileDocument, cultDocument, cultPrivateDocument, passportDocument, inboxContainer }
}
