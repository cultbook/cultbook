import React, { useMemo, useState } from 'react'

import { rdfs, foaf, vcard, ldp } from 'rdf-namespaces'
import { useWebId } from "@solid/react"
import { describeDocument } from "plandoc"

import Button from '@material-ui/core/Button';

import { useModel, cb, Cult, Rule, Ritual } from "../model"
import { useDocument, useCult, usePassport } from "../data"
import { as } from "../vocab"
import { inviteFollower, deleteNotification } from "../services"

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

export default function Notification({uri}){
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
