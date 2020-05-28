import React from 'react'

import { useWebId } from "@solid/react"
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { ldp } from 'rdf-namespaces'

import { useDocument } from "../data"
import { useModel } from "../model"
import Notifications from "../components/Notifications"
import DefaultLayout from "../layouts/Default"

const st = {
  mtime: "http://www.w3.org/ns/posix/stat#mtime"
}

const useStyles = makeStyles(theme => ({
  root: {

  },
}))

export default function NotificationsPage({children}) {
  const classes = useStyles();
  const webId = useWebId()
  const { inboxContainer } = useModel(webId)
  const [ inboxContainerDoc ] = useDocument(inboxContainer)

  const inbox = inboxContainerDoc && inboxContainerDoc.getSubject(inboxContainerDoc.asRef())
  const notifications = inbox && inbox.getAllRefs(ldp.contains).
        map(notificationRef => inboxContainerDoc.getSubject(notificationRef)).
        sort((a, b) => (b.getDecimal(st.mtime) - a.getDecimal(st.mtime))).
        map(notification => notification.asRef())

  return (
    <DefaultLayout>
      <Grid item xs={12}>
        <Typography variant="h1">Notifications</Typography>
      </Grid>
      {notifications && <Notifications notifications={notifications}/>}
    </DefaultLayout>
  )
}
