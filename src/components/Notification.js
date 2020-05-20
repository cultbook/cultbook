import React from 'react'

import { useWebId } from "@solid/react"

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { useModel } from "../model"
import { usePassport, useNotification, useProfileByWebId, useCultByRef } from "../data"
import { as } from "../vocab"
import { deleteNotification } from "../services"
import Loader from "../components/Loader"

function NotificationCultDetails({cultUri}){
  const [ cult ] = useCultByRef(cultUri)
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
      <Typography variant="h4">{notification && notification.name}</Typography>
      <Typography variant="h5">{notification && notification.description}</Typography>
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
      <Typography variant="h4">{notification && notification.name}</Typography>
      <Typography variant="h5">{notification && notification.description}</Typography>
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

function ApplicationNotification({notification}){
  const [ profile ] = useProfileByWebId(notification && notification.actor)
  const [ cult ] = useCultByRef(notification && notification.object)

  const approveApplication = async () => {
    cult.addMember(profile.asRef())
    await cult.save()
    await deleteNotification(notification.asRef())
  }
  return (
    <div>
      <h4>{notification && notification.name}</h4>
      <h5>{notification && notification.description}</h5>
      <h5>Applicant: {profile && profile.name}</h5>
      <Button onClick={() => approveApplication()}>accept application</Button>
      <Button onClick={() => deleteNotification(notification.asRef())}>deny application</Button>
    </div>
  )
}

const typesToNotificationComponents = {
  [as.Invite]: InviteNotification,
  [as.Create]: CreatedNotification,
  [as.Follow]: ApplicationNotification
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
