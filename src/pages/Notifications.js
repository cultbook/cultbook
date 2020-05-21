import React from 'react'

import { useWebId } from "@solid/react"
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { ldp } from 'rdf-namespaces'

import { useDocument } from "../data"
import { useModel } from "../model"
import Notification from "../components/Notification"
import DefaultLayout from "../layouts/Default"


const useStyles = makeStyles(theme => ({
  root: {

  },
}))

export default function Notifications({children}) {
  const classes = useStyles();
  const webId = useWebId()
  const { inboxContainer } = useModel(webId)
  const [ inboxContainerDoc ] = useDocument(inboxContainer)

  const inbox = inboxContainerDoc && inboxContainerDoc.getSubject(inboxContainerDoc.asRef())
  const notifications = inbox && inbox.getAllRefs(ldp.contains)
  return (
    <DefaultLayout>
      <Grid item xs={12}>
        <Typography variant="h1">Notifications</Typography>
        {notifications && (
          <>
            {notifications.map(notification => (
              <Notification uri={notification} key={notification}/>
            ))}
          </>
        )}
      </Grid>
    </DefaultLayout>
  )
}
