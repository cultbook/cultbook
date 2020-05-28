import React from 'react'

import { useWebId } from "@solid/react"

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { foaf } from 'rdf-namespaces';
import Iframe from 'react-iframe'
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';

import { cb, useModel } from "../model"
import { usePassport, useNotification, useProfileByWebId, useCultByRef } from "../data"
import { as } from "../vocab"
import { deleteNotification } from "../services"
import Loader from "../components/Loader"
import Link from "../components/Link"
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

const useStyles = makeStyles(theme => ({
  htmlNotificationIframe: {
    margin: "auto",
    width: "33vw",
    height: "66vw"
  },
}))

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
      <Typography variant="h5">{notification && notification.description}</Typography>
      <NotificationCultDetails cultUri={cultUri}/>
      <Button onClick={() => recordCult()}>take note</Button>
      <Button onClick={() => deleteNotification(notification.asRef())}>forget about it</Button>
    </div>
  )
}

function ApplicationNotification({notification, ...props}){
  const [ profile ] = useProfileByWebId(notification && notification.actor)
  const [ cult ] = useCultByRef(notification && notification.object)

  const approveApplication = async () => {
    cult.addMember(profile.asRef())
    await cult.save()
    await deleteNotification(notification.asRef())
  }
  return (
    <div>
      <Typography variant="h5">{notification && notification.description}</Typography>
      <Typography variant="h5">Applicant: {profile && profile.name}</Typography>
      {cult && (
        <>
          {cult.isFull ? (
            <Typography variant="h5">Your cult is full: <Link to="/me/cult">banish members to add more</Link></Typography>
          ) : (
            <Button onClick={() => approveApplication()}>accept application</Button>
          )}
        </>
      )}
      <Button onClick={() => deleteNotification(notification.asRef())}>deny application</Button>
    </div>
  )
}

function ImageNotification({notification}){
  return (
    <img src={notification && notification.subject.getRef(foaf.img)}/>
  )
}

function HTMLNotification({notification}){
  const classes = useStyles()
  return (
      <Iframe url={notification && notification.subject.getRef(cb.notificationHtml)}
              className={classes.htmlNotificationIframe}/>
  )
}

const typesToNotificationComponents = {
  [as.Invite]: InviteNotification,
  [as.Create]: CreatedNotification,
  [as.Follow]: ApplicationNotification,
  [cb.ImageNotification]: ImageNotification,
  [cb.HTMLNotification]: HTMLNotification
}

function notificationComponentForType(type){
  const Component = typesToNotificationComponents[type]
  return Component || GenericNotification
}

export default function Notification({uri}){
  const [notification] = useNotification(uri)
  if (notification){
    const NotificationComponent = notificationComponentForType(notification.type)
    return (
      <ExpansionPanel TransitionProps={{ unmountOnExit: true }} >
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5">{notification && notification.name}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Box margin="auto">
            <NotificationComponent notification={notification} />
          </Box>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    )
  } else {
    return <Loader/>
  }
}
