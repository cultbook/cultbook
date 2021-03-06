import React, {useState} from 'react'

import { useWebId } from "@solid/react"

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { foaf } from 'rdf-namespaces';
import Iframe from 'react-iframe'
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';

import Tooltip from '@material-ui/core/Tooltip';
import ArchiveIcon from '@material-ui/icons/Archive';
import ReactMarkdown from "react-markdown";

import { cb, useModel } from "../model"
import { usePassport, useNotification, useProfileByWebId, useCultByRef } from "../data"
import { as } from "../vocab"
import { deleteNotification } from "../services"
import Loader from "../components/Loader"
import Link from "../components/Link"
import ButtonLink from "../components/ButtonLink"
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import * as urls from "../urls"
import {moveDocument} from "../utils/fetch"



const useStyles = makeStyles(theme => ({
  htmlNotificationIframe: {
    margin: "auto",
    width: "33vw",
    height: "66vw"
  },
  expansionPanel: {
    position: "relative"
  },
  archive: {
    position: "absolute",
    right: 0,
    bottom: "-6px"
  },
  textNotification: {
    whiteSpace: "pre-wrap",
    textAlign: "left"
  }
}))

function NotificationCultDetails({cultUri}){
  const [ cult ] = useCultByRef(cultUri)
  const name = cult && cult.name

  return (
    <div>
      {name}
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

function TextNotification({notification}){
  const classes = useStyles()
  return (
    <div>
      <Typography variant="body1" className={classes.textNotification}>{notification && notification.description}</Typography>
    </div>
  )
}

function MarkdownNotification({notification}){
  const classes = useStyles()
  return (
    <div>
      <Typography variant="body1">
        {notification && (
          <ReactMarkdown source={notification.description} renderers={{link: (props) => <Link {...props}/>}}/>
        )}
      </Typography>
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

function InductedNotification({notification}){
  const cultUri = notification && notification.object
  const [cult] = useCultByRef(cultUri)
  return (
    <div>
      <Typography variant="h5">{notification && notification.description}</Typography>
      {cult && (
        <ButtonLink to={urls.cult(cult)}>
          Enter Lair of {cult.name}
        </ButtonLink>
      )}
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
    await cult.addAndNotifyMember(profile.asRef())
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
    <img src={notification && notification.subject.getRef(foaf.img)} alt={notification && notification.name}/>
  )
}

function HTMLNotification({notification}){
  const classes = useStyles()
  return (
      <Iframe url={notification && notification.subject.getRef(cb.notificationHtml)}
              className={classes.htmlNotificationIframe}/>
  )
}

function VideoNotification({notification}){
  const classes = useStyles()
  return (
    <div>
      <video controls src={notification && notification.object}> </video>
    </div>
  )
}

function AudioNotification({notification}){
  const classes = useStyles()
  return (
    <div>
      <audio controls src={notification && notification.object}> </audio>
    </div>
  )
}

function ReportNotification({notification}){
  const classes = useStyles()
  const [ profile ] = useProfileByWebId(notification && notification.actor)

  return (
    <div>
      <Typography variant="h5">
        Reporter: <Link to={urls.profileByRef(notification.actor)}>{profile && profile.name}</Link>
      </Typography>
      {notification.object && (
        <Typography variant="h6">
          Object: <Link href={notification.object}>{notification.object}</Link>
        </Typography>
      )}
      <Typography variant="body1">
        {notification.description}
      </Typography>
    </div>
  )
}

const typesToNotificationComponents = {
  [as.Invite]: InviteNotification,
  [as.Create]: CreatedNotification,
  [as.Follow]: ApplicationNotification,
  [cb.ImageNotification]: ImageNotification,
  [cb.HTMLNotification]: HTMLNotification,
  [cb.InductedNotification]: InductedNotification,
  [cb.Report]: ReportNotification,
  [cb.VideoNotification]: VideoNotification,
  [cb.AudioNotification]: AudioNotification,
  [cb.TextNotification]: TextNotification,
  [cb.MarkdownNotification]: MarkdownNotification,
}

function notificationComponentForType(type){
  const Component = typesToNotificationComponents[type]
  return Component || GenericNotification
}

export default function Notification({uri, archiveContainerRef}){
  const classes = useStyles()
  const [archiving, setArchiving] = useState(false)
  const [notification] = useNotification(uri)
  const archive = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setArchiving(true)
    await moveDocument(uri, `${archiveContainerRef}/${uri.split("/").slice(-1)[0]}`)
    setArchiving(false)
  }
  if (notification){
    const NotificationComponent = notificationComponentForType(notification.type)
    return (
      <ExpansionPanel TransitionProps={{ unmountOnExit: true }} >
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} classes={{content: classes.expansionPanel}}>
          <Typography variant="h5">{notification && notification.name}</Typography>
          {archiveContainerRef && (
            <Box className={classes.archive}>
              {archiving ? (<Loader size="sm"/>) : (
                <Tooltip title="Archive" aria-label="copy to clipboard">
                  <IconButton onClick={archive}>
                    <ArchiveIcon/>
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          )}
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
