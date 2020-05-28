import React, {useState, useMemo} from 'react'

import { useWebId } from "@solid/react"
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {experimental_serialise} from "plandoc"
import { ldp } from 'rdf-namespaces'

import { useDocument } from "../data"
import { useModel, makeArchiveVirtualDoc } from "../model"
import Notifications from "../components/Notifications"
import DefaultLayout from "../layouts/Default"


const st = {
  mtime: "http://www.w3.org/ns/posix/stat#mtime"
}

const useStyles = makeStyles(theme => ({
  root: {

  },
}))

const sortedNotifications = (containerDoc) => {
  const container = containerDoc && containerDoc.getSubject(containerDoc.asRef())
  const notifications = container && container.getAllRefs(ldp.contains).
        map(notificationRef => containerDoc.getSubject(notificationRef)).
        sort((a, b) => (b.getDecimal(st.mtime) - a.getDecimal(st.mtime))).
        map(notification => notification.asRef())
  return notifications
}


function Inbox({container, archiveContainerRef}){
  const [ inboxContainerDoc ] = useDocument(container)
  const notifications = sortedNotifications(inboxContainerDoc)
  return (
    <>
      {notifications && <Notifications notifications={notifications} archiveContainerRef={archiveContainerRef}/>}
    </>
  )
}

function Archive({virtualDoc}){
  const [ archiveDoc ] = useDocument(virtualDoc)
  const notifications = sortedNotifications(archiveDoc)
  return (
    <>
      {notifications && <Notifications notifications={notifications}/>}
    </>
  )
}

export default function NotificationsPage({children}) {
  const classes = useStyles();
  const webId = useWebId()
  const [tab, setTab] = useState(0)
  const { inboxContainer, storage } = useModel(webId)
  const [ storageDoc ] = useDocument(storage)
  const archiveVirtualDoc = useMemo(() => makeArchiveVirtualDoc(storageDoc), [storageDoc])
  const archiveContainerRef = archiveVirtualDoc && experimental_serialise(archiveVirtualDoc).reference

  return (
    <DefaultLayout>
      <Grid item xs={12}>
        <Typography variant="h1">Notifications</Typography>
      </Grid>
      <Grid item xs={12}>
        <Tabs value={tab} onChange={(e, value) => setTab(value)} aria-label="notifications tabs">
          <Tab label="Inbox" />
          <Tab label="Archive" />
        </Tabs>
      </Grid>
      {(tab === 0) && <Inbox container={inboxContainer} archiveContainerRef={archiveContainerRef}/>}
      {(tab === 1) && <Archive virtualDoc={archiveVirtualDoc}/>}
    </DefaultLayout>
  )
}
