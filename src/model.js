import { useState, useEffect } from "react"
import { describeSubject, describeDocument, describeContainer } from "plandoc"
import * as td from "tripledoc";
import { space, solid, rdf, rdfs, ldp, vcard, foaf, schema, cal, acl, dct } from "rdf-namespaces"
import { v4 as uuid } from 'uuid';

import { as } from "./vocab"
import { postToInbox, documentExists, inviteMember, notifyMember } from "./services"
import { wwwCultInbox } from "./constants"
import { createPrivateCultDocAcl, createRitualUploadFolderAcl } from "./utils/acl"

const prefix = "https://thecultbook.com/ontology#"

export const cb = {
  Cult: `${prefix}Cult`,
  Passport: `${prefix}Passport`,
  Performance: `${prefix}Performance`,
  Report: `${prefix}Report`,
  ImageNotification: `${prefix}ImageNotification`,
  HTMLNotification: `${prefix}HTMLNotification`,
  InductedNotification: `${prefix}InductedNotification`,
  follows: `${prefix}follows`,
  convening: `${prefix}convening`,
  convenedBy: `${prefix}convenedBy`,
  demands: `${prefix}demands`,
  demandedBy: `${prefix}demandedBy`,
  prescribes: `${prefix}prescribes`,
  prescribedBy: `${prefix}prescribedBy`,
  performed: `${prefix}performed`,
  swornTo: `${prefix}swornTo`,
  attending: `${prefix}attending`,
  knowsAbout: `${prefix}knowsAbout`,
  veilRemoved: `${prefix}veilRemoved`,
  uploadFolder: `${prefix}uploadFolder`,
  notificationHtml: `${prefix}notificationHtml`,
  archive: `${prefix}archive`,
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

  get cultRef() {
    return this.subject.getRef(cb.prescribedBy)
  }

  set cult(cult){
    this.subject.setRef(cb.prescribedBy, cult.privateAsRef())
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

  get uploadFolderVirtualDocument(){
    if (!this._uploadFolderVirtualDocument){
      this._uploadFolderVirtualDocument = describeDocument().isFoundAt(this.uploadFolder)
    }
    return this._uploadFolderVirtualDocument
  }

  async addPerformance(performerWebId, performanceArtifactRef, performanceName, type){
    return postToInbox(this.uploadFolder, `
@prefix inv: <>.
@prefix dct: <http://purl.org/dc/terms/>.
@prefix cb: <https://thecultbook.com/ontology#>.
@prefix as: <https://www.w3.org/ns/activitystreams#>.

inv: a cb:Performance;
    dct:title "${performanceName}";
    dct:format "${type}";
    as:actor <${performerWebId}>;
    as:object <${performanceArtifactRef}>.
`)
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

  get storage(){
    return this.subject.getRef(space.storage)
  }

  get publicStorage(){
    return this.storage && `${this.storage}public`
  }

  get privateStorage(){
    return this.storage && `${this.storage}private`
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

  get hasPrivateAccess() {
    return !!this.privateDocument
  }

  get members() {
    return this.privateSubject && this.privateSubject.getAllRefs(vcard.hasMember)
  }

  get isFull(){
    return (this.members.length >= 26)
  }

  hasMember(webId){
    return new Set(this.members).has(webId)
  }

  removeMember(memberWebId) {
    this.privateSubject && this.privateSubject.removeRef(vcard.hasMember, memberWebId)
  }

  addMember(webId) {
    this.privateSubject && this.privateSubject.addRef(vcard.hasMember, webId)
  }

  async addAndNotifyMember(memberWebId){
    this.addMember(memberWebId)
    await this.save()
    await notifyMember(memberWebId, this.asRef())
  }

  async addAndInviteMember(memberWebId){
    this.addMember(memberWebId)
    await this.save()
    await inviteMember(memberWebId, this.asRef())
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
      ritual.cult = this
      this.privateSubject.addRef(cb.prescribes, ritual.asRef())
      await ritual.ensureUploadFolder(this.ownerWebId)
      await ritual.save()
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

  addGathering(name, description, location, time) {
    if (this.privateDocument){
      const gathering = new Gathering(this.privateDocument, this.privateDocument.addSubject(), this.save)
      gathering.name = name
      gathering.description = description
      gathering.location = location
      gathering.time = time
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

  get aclRef(){
    return this.privateDocument && `${this.privateDocument.asRef()}.acl`
  }

  async isAclInPlace(){
    return documentExists(this.aclRef)
  }

  async ensureAcl(creatorWebId){
    return createPrivateCultDocAcl(this.privateDocument.asRef(), creatorWebId || this.ownerWebId)
  }

  async ensureOwnerMember(){
    this.addMember(this.ownerWebId)
    return await this.save()
  }

  isOwnerMember(){
    return !!this.members.find(m => (m === this.ownerWebId))
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
    this.addMember(creator)
    this.name = name
    await Promise.all([
      this.save(),
      this.ensureAcl(creator),
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

  privateAsRef() {
    return this.privateSubject.asRef()
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

  isFollowingRef(cultRef){
    return !!this.following && this.following.find(f => (f === cultRef))
  }

  isFollowing(cult){
    return this.isFollowingRef(cult.asRef())
  }

  async followAndApplyToJoin(cult, webId){
    this.addFollowing(cult.asRef())
    await this.save()
    await cult.applyToJoin(webId)
  }

  isSwornTo(rule) {
    const ref = rule.asRef()
    return !!this.subject.getAllRefs(cb.swornTo).find(rule => (rule === ref))
  }

  swearTo(rule) {
    this.subject.addRef(cb.swornTo, rule.asRef())
  }

  breakOath(rule) {
    this.subject.removeRef(cb.swornTo, rule.asRef())
  }

  get rules(){
    return this.subject.getAllRefs(cb.swornTo)
  }

  async getRules(){
    return this.rules ? (
      Promise.all(
        this.rules.map(async (ruleRef) => {
          const doc = await td.fetchDocument(ruleRef)
          return new Rule(doc, doc.getSubject(ruleRef), doc.save)
        })
      )
    ) : []
  }

  isAttending(gathering) {
    const ref = gathering.asRef()
    return !!this.subject.getAllRefs(cb.attending).find(g => (g === ref))
  }

  attend(gathering) {
    this.subject.addRef(cb.attending, gathering.asRef())
  }

  cancelPlans(gathering) {
    this.subject.removeRef(cb.attending, gathering.asRef())
  }

  get rsvps(){
    return this.subject.getAllRefs(cb.attending)
  }

  async getGatherings(){
    return this.rsvps ? (
      Promise.all(
        this.rsvps.map(async (gatheringRef) => {
          const doc = await td.fetchDocument(gatheringRef)
          return new Gathering(doc, doc.getSubject(gatheringRef), doc.save)
        })
      )
    ) : []
  }

  addPerformance(performanceRef){
    this.subject.addRef(cb.performed, performanceRef)
  }

  get performances(){
    return this.subject.getAllRefs(cb.performed)
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

export class Performance {
  constructor(document, save) {
    this.document = document
    this.subject = document.getSubject(document.asRef())
    this.save = save
  }

  asRef() {
    return this.subject.asRef()
  }

  get title(){
    return this.subject.getString(dct.title)
  }

  get object(){
    return this.subject.getRef(as.object)
  }

  get actor(){
    return this.subject.getRef(as.actor)
  }

  get type(){
    return this.subject.getRef(dct.format)
  }
}

export function privateCultDocument(publicCultVirtualDocument){
  const cultPrivateDocRegistration = describeSubject()
        .isFoundIn(publicCultVirtualDocument)
        .withRef(rdf.type, solid.TypeRegistration)
        .withRef(solid.forClass, cb.Cult)
  return describeDocument().isFoundOn(cultPrivateDocRegistration, rdfs.seeAlso)
}

const modelCache = {

}

export function cultDocumentFromWebId(webId){
  const profileSubject = describeSubject().isFoundAt(webId)
  const storage = describeContainer()
        .isFoundOn(profileSubject, space.storage);
  const publicTypeIndex = describeDocument()
        .isFoundOn(profileSubject, solid.publicTypeIndex)
  const publicStorage = describeContainer().experimental_isContainedIn(storage, "public")
  const privateStorage = describeContainer().experimental_isContainedIn(storage, "private")
  const cultPublicTypeRegistration = describeSubject()
        .isFoundIn(publicTypeIndex)
        .withRef(rdf.type, solid.TypeRegistration)
        .withRef(solid.forClass, cb.Cult)
  const cultDocument = describeDocument()
        .isFoundOn(cultPublicTypeRegistration, solid.instance, publicStorage)
  const cultPrivateDocRegistration = describeSubject()
        .isFoundIn(cultDocument)
        .withRef(rdf.type, solid.TypeRegistration)
        .withRef(solid.forClass, cb.Cult)
  const cultPrivateDocument = describeDocument()
        .isFoundOn(cultPrivateDocRegistration, rdfs.seeAlso, privateStorage)
  return [cultDocument, cultPrivateDocument]
}

export function useModel(webId){
  const [model, setModel] = useState({})
  useEffect(() => {
    if (webId){
      if (modelCache[webId]){
        setModel(modelCache[webId])
      } else {
        const profileDocument = describeDocument().isFoundAt(webId)

        const profileSubject = describeSubject().isFoundAt(webId)

        const storage = describeContainer()
              .isFoundOn(profileSubject, space.storage);
        const publicStorage = describeContainer().experimental_isContainedIn(storage, "public")
        const privateStorage = describeContainer().experimental_isContainedIn(storage, "private")

        const inboxContainer = describeContainer().isFoundOn(profileSubject, ldp.inbox)

        const publicTypeIndex = describeDocument()
              .isFoundOn(profileSubject, solid.publicTypeIndex)

        const cultPublicTypeRegistration = describeSubject()
              .isEnsuredIn(publicTypeIndex)
              .withRef(rdf.type, solid.TypeRegistration)
              .withRef(solid.forClass, cb.Cult)
        const cultDocument = describeDocument()
              .isEnsuredOn(cultPublicTypeRegistration, solid.instance, publicStorage)

        const cultPrivateDocRegistration = describeSubject()
              .isEnsuredIn(cultDocument)
              .withRef(rdf.type, solid.TypeRegistration)
              .withRef(solid.forClass, cb.Cult)
        const cultPrivateDocument = describeDocument()
              .isEnsuredOn(cultPrivateDocRegistration, rdfs.seeAlso, privateStorage)

        const passportPublicTypeRegistration = describeSubject()
              .isEnsuredIn(publicTypeIndex)
              .withRef(rdf.type, solid.TypeRegistration)
              .withRef(solid.forClass, cb.Passport)
        const passportDocument = describeDocument()
              .isEnsuredOn(passportPublicTypeRegistration, solid.instance, publicStorage)

        const newModel = { profileDocument, cultDocument, cultPrivateDocument, passportDocument, inboxContainer, storage }
        modelCache[webId] = newModel
        setModel(newModel)
      }
    }
  }, [webId])
  return model
}

export const makeArchiveVirtualDoc = (storageDoc) =>
  storageDoc && describeContainer().experimental_isFoundAt(`${storageDoc.asRef()}private/inboxArchive/`)
