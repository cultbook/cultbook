import React from 'react'

import { useWebId } from "@solid/react"
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { rdfs, foaf, vcard, ldp } from 'rdf-namespaces'

import { useDocument, usePassport } from "../data"
import { useModel, cb, Cult, Rule, Ritual } from "../model"
import Notification from "../components/Notification"
import AppBar from "../components/AppBar"
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
        <h3>Notifications</h3>
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
