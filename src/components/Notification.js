import React, { useMemo } from 'react'

import { rdfs } from 'rdf-namespaces'
import { useWebId } from "@solid/react"
import { describeDocument } from "plandoc"

import Button from '@material-ui/core/Button';

import { useModel, cb, Cult, Rule, Ritual } from "../model"
import { useDocument, useCult, usePassport, useNotification } from "../data"
import { as } from "../vocab"
import { inviteFollower, deleteNotification } from "../services"
import Loader from "../components/Loader"

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



function GenericNotification({notification}){
  return (
    <div>
      <h4>{notification && notification.name}</h4>
      <h5>{notification && notification.description}</h5>
    </div>
  )
}

function InviteNotification({notification}){
  const cultUri = notification && notification.object
  const webId = useWebId()
  const { passportDocument } = useModel(webId)
  const [ passport ] = usePassport(passportDocument)
  const acceptInvitation = () => {
    passport.addFollowing(cultUri)
    passport.save()
  }
  return (
    <div>
      <h4>{notification && notification.name}</h4>
      <h5>{notification && notification.description}</h5>
      <NotificationCultDetails cultUri={cultUri}/>
      <Button onClick={() => acceptInvitation()}>accept invitation</Button>
      <Button onClick={() => deleteNotification(notification.asRef())}>delete invitation</Button>
    </div>
  )
}

function CreatedNotification({notification}){
  const cultUri = notification && notification.object
  const webId = useWebId()
  const { passportDocument } = useModel(webId)
  const [ passport ] = usePassport(passportDocument)
  const recordCult = async () => {
    passport.addKnown(cultUri)
    await passport.save()
    await deleteNotification(notification.asRef())
  }
  return (
    <div>
      <h4>{notification && notification.name}</h4>
      <h5>{notification && notification.description}</h5>
      <NotificationCultDetails cultUri={cultUri}/>
      <Button onClick={() => recordCult()}>take note</Button>
      <Button onClick={() => deleteNotification(notification.asRef())}>forget about it</Button>
    </div>
  )
}

const typesToNotificationComponents = {
  [as.Invite]: InviteNotification,
  [as.Create]: CreatedNotification
}

function notificationComponentForType(type){
  const Component = typesToNotificationComponents[type]
  return Component || GenericNotification
}

export default function Notification({uri}){
  const [notification] = useNotification(uri)
  if (notification){
    const NotificationComponent = notificationComponentForType(notification.type)
    return <NotificationComponent notification={notification}/>
  } else {
    return <Loader/>
  }
}
