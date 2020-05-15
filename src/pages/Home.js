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
import { AddFollowerSchema, CultSchema } from "../validations"
import { inviteFollower, deleteNotification } from "../services"

const useStyles = makeStyles(theme => ({
  logo: {
    fontFamily: "gothicus, serif",
    color: "#ac5858",
    marginTop: 0,
    marginBottom: 0,
    fontSize: "6.6vw"
  }
}))

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

  asRef() {
    return this.subject.asRef()
  }
}

function useCult(cultDocument){
  const [cultDoc, save, loading, error] = useDocument(cultDocument)
  const cult = useMemo(
    () => cultDoc && new Cult(cultDoc, save),
    [cultDoc]
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
  const name = cult && cult.getString(rdfs.label)

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

function EditableCultName({cult, save}){
  const [editing, setEditing] = useState(false)
  const name = cult && cult.name
  const setName = async (newName) => {
    if (name !== newName) {
      cult.name = newName
      await cult.save()
    }
    setEditing(false)
  }
  return editing ? (
    <Formik
      initialValues={{name: name || ""}}
      onSubmit={({name}) => { setName(name) }}
      validationSchema={CultSchema}
    >
      <Form>
        <TextField name="name" type="text" placeholder="cult name"/>
        <Button type="submit">Set</Button>
      </Form>
    </Formik>
  ) : (
    <h3 onClick={() => setEditing(true)}>
      {name || "Set cult name"}
    </h3>
  )
}

function EditableCultDescription({cult}){
  const [editing, setEditing] = useState(false)
  const description = cult && cult.description
  const setDescription = async (newDescription) => {
    if (description !== newDescription) {
      cult.description = newDescription
      await cult.save()
    }
    setEditing(false)
  }
  return editing ? (
    <Formik
      initialValues={{description: description || ""}}
      onSubmit={({description}) => { setDescription(description) }}
      validationSchema={CultSchema}
    >
      <Form>
        <TextField name="description" type="text" placeholder="cult description"/>
        <Button type="submit">Set</Button>
      </Form>
    </Formik>
  ) : (
    <p onClick={() => setEditing(true)}>
      {description || "Set cult description"}
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
          <TextField name="follower" type="text"/>
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

function CultInfo({cult}){
  return (
    <>
      <EditableCultName cult={cult}/>
      <EditableCultDescription cult={cult}/>
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
    <>
      <header className="App-header">
        <h1 className={classes.logo}>cultbook</h1>
      </header>
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
    </>
  )
}
