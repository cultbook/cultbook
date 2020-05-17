import React, { useMemo, useState } from 'react'

import { useWebId } from "@solid/react"
import { rdfs, foaf, vcard, ldp } from 'rdf-namespaces'
import { Form, Formik } from 'formik';
import { describeDocument } from "plandoc"

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { as } from "../vocab"
import { useModel, cb } from "../model"
import { useDocument } from "../data"
import LogoutButton from "../components/LogoutButton"
import { TextField } from "../components/form"
import DefaultLayout from "../layouts/Default"
import { AddFollowerSchema, CultSchema, RitualSchema, RuleSchema } from "../validations"
import { inviteFollower, deleteNotification } from "../services"

const useStyles = makeStyles(theme => ({
}))

class Rule {
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

class Ritual {
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

class Cult {
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

function useCult(cultDocument){
  const [cultDoc, save, loading, error] = useDocument(cultDocument)
  const cult = useMemo(
    () => cultDoc && new Cult(cultDoc, save),
    [cultDoc, save]
  )
  return [ cult, loading, error ]
}

function usePassport(passportDocument){
  const [ passportDoc, save, loading, error ] = useDocument(passportDocument)
  const passport = useMemo(
    () => passportDoc && passportDoc.getSubject(`${passportDoc.asRef()}#passport`),
    [passportDoc]
  )
  return [ passport, save, loading, error ]
}

function NotificationCultDetails({cultUri}){
  const cultDocument = useMemo(() => describeDocument().isFoundAt(cultUri), [cultUri])
  const [ cult ] = useCult(cultDocument)
  const name = cult && cult.name

  return (
    <div>
      cult name: {name}
    </div>
  )
}

function Notification({uri}){
  const notificationDocument = useMemo(() => describeDocument().isFoundAt(uri), [uri])
  const [ notificationDoc ] = useDocument(notificationDocument)
  const notification = notificationDoc && notificationDoc.getSubject(notificationDoc.asRef())
  const cultUri = notification && notification.getRef(as.object)

  const webId = useWebId()
  const { passportDocument } = useModel(webId)
  const [ passport, savePassport ] = usePassport(passportDocument)
  const acceptInvitation = () => {
    passport.addRef(cb.follows, cultUri)
    savePassport()
  }
  return (
    <div>
      <h4>{notification && notification.getString(rdfs.label)}</h4>
      <h5>{notification && notification.getString(rdfs.comment)}</h5>
      <NotificationCultDetails cultUri={cultUri}/>
      <Button onClick={() => acceptInvitation()}>accept invitation</Button>
      <Button onClick={() => deleteNotification(uri)}>delete invitation</Button>
    </div>
  )
}

function EditableName({entity, schema}){
  const [editing, setEditing] = useState(false)
  const name = entity && entity.name
  const setName = async (newName) => {
    if (name !== newName) {
      entity.name = newName
      await entity.save()
    }
    setEditing(false)
  }
  return editing ? (
    <Formik
      initialValues={{name: name || ""}}
      onSubmit={({name}) => { setName(name) }}
      validationSchema={schema}
    >
      <Form>
        <TextField name="name" type="text" placeholder="name" autoFocus/>
        <Button type="submit">save</Button>
      </Form>
    </Formik>
  ) : (
    <h3 onClick={() => setEditing(true)}>
      {name || "click to set name"}
    </h3>
  )
}

function EditableDescription({entity, schema}){
  const [editing, setEditing] = useState(false)
  const description = entity && entity.description
  const setDescription = async (newDescription) => {
    if (description !== newDescription) {
      entity.description = newDescription
      await entity.save()
    }
    setEditing(false)
  }
  return editing ? (
    <Formik
      initialValues={{description: description || ""}}
      onSubmit={({description}) => { setDescription(description) }}
      validationSchema={schema}
    >
      <Form>
        <TextField name="description" type="text" placeholder="description" autoFocus/>
        <Button type="submit">save</Button>
      </Form>
    </Formik>
  ) : (
    <p onClick={() => setEditing(true)}>
      {description || "click to set description"}
    </p>
  )
}

function EditableCultFollowers({cult}){
  const followers = cult && cult.followers
  const addFollower = async (followerWebId) => {
    cult.addFollower(followerWebId)
    await cult.save()
    await inviteFollower(followerWebId, cult.asRef())
  }
  const removeFollower = async (followerWebId) => {
    cult.removeFollower(followerWebId)
    await cult.save()
  }
  return (
    <>
      <h4>Followers</h4>
      <Formik
        initialValues={{follower: ""}}
        onSubmit={({follower}) => {addFollower(follower)}}
        validationSchema={AddFollowerSchema}
      >
        <Form>
          <TextField name="follower" type="text" placeholder="webid"/>
          <Button type="submit">Add a Follower</Button>
        </Form>
      </Formik>
      {followers && (
        <ul>
          {followers.map(follower => (
            <li key={follower}>
              {follower}
              <Button onClick={() => removeFollower(follower)}>
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}


function EditableCultRituals({cult}){
  const rituals = cult && cult.rituals
  const addRitual = async (name, description) => {
    cult.addRitual(name, description)
    await cult.save()
  }
  const removeRitual = async (ritual) => {
    cult.removeRitual(ritual)
    await cult.save()
  }
  const submitAddRitual = async ({name, description}, {resetForm}) => {
    await addRitual(name, description)
    resetForm()
  }
  return (
    <>
      <h4>Rituals</h4>
      <Formik
        initialValues={{name: "", description: ""}}
        onSubmit={submitAddRitual}
        validationSchema={RitualSchema}
      >
        <Form>
          <TextField name="name" type="text" placeholder="name"/>
          <TextField name="description" type="text" placeholder="description"/>
          <Button type="submit">Add a Ritual</Button>
        </Form>
      </Formik>
      {rituals && (
        <ul>
          {rituals.map(ritual => (
            <li key={ritual.asRef()}>
              <EditableName entity={ritual} schema={RitualSchema}/>
              <EditableDescription entity={ritual} schema={RitualSchema}/>
              <Button onClick={() => removeRitual(ritual)}>
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

function EditableCultRules({cult}){
  const rules = cult && cult.rules
  const addRule = async (name, description) => {
    cult.addRule(name, description)
    await cult.save()
  }
  const removeRule = async (rule) => {
    cult.removeRule(rule)
    await cult.save()
  }
  const submitAddRule = async ({name, description}, {resetForm}) => {
    await addRule(name, description)
    resetForm()
  }
  return (
    <>
      <h4>Rules</h4>
      <Formik
        initialValues={{name: "", description: ""}}
        onSubmit={submitAddRule}
        validationSchema={RuleSchema}
      >
        <Form>
          <TextField name="name" type="text" placeholder="name"/>
          <TextField name="description" type="text" placeholder="description"/>
          <Button type="submit">Add a Rule</Button>
        </Form>
      </Formik>
      {rules && (
        <ul>
          {rules.map(rule => (
            <li key={rule.asRef()}>
              <EditableName entity={rule} schema={RuleSchema}/>
              <EditableDescription entity={rule} schema={RuleSchema}/>
              <Button onClick={() => removeRule(rule)}>
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

function CultInfo({cult}){
  return (
    <>
      <EditableName entity={cult} schema={CultSchema}/>
      <EditableDescription entity={cult} schema={CultSchema}/>
      <EditableCultRituals cult={cult} />
      <EditableCultRules cult={cult} />
      <EditableCultFollowers cult={cult}/>
    </>
  )
}

export default function HomePage(){
  const classes = useStyles();
  const webId = useWebId()
  const { inboxContainer, profileDocument, cultDocument, passportDocument } = useModel(webId)

  const [ profileDoc ] = useDocument(profileDocument)
  const [ inboxContainerDoc ] = useDocument(inboxContainer)

  const inbox = inboxContainerDoc && inboxContainerDoc.getSubject(inboxContainerDoc.asRef())
  const notifications = inbox && inbox.getAllRefs(ldp.contains)

  const [ passport, savePassport ] = usePassport(passportDocument)
  const following = passport && passport.getAllRefs(cb.follows)

  const [ cult ] = useCult(cultDocument)

  return (
    <DefaultLayout>
      <h2>
        Welcome, {profileDoc && profileDoc.getSubject(webId).getString(foaf.name)}
      </h2>
      {notifications && (
        <>
          <h3>Notifications</h3>
          {notifications.map(notification => (
            <Notification uri={notification}/>
          ))}
        </>
      )}
      {following && (
        <>
          <h2>Cults You Follow</h2>
          <ul>
            {following.map(cult => (
              <li>{cult.toString()}</li>
            ))}
          </ul>
        </>
      )}

      <h2>Your Cult</h2>
      {cult && <CultInfo cult={cult} />}
      <LogoutButton/>
    </DefaultLayout>
  )
}
