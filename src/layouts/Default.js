import React from 'react'

import { useWebId } from "@solid/react"
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { rdfs, foaf, vcard, ldp } from 'rdf-namespaces'

import { useDocument, useCult, usePassport } from "../data"
import { useModel, cb, Cult, Rule, Ritual } from "../model"
import Notification from "../components/Notification"


const useStyles = makeStyles(theme => ({
  root: {

  },
  logo: {
    fontFamily: "gothicus, serif",
    color: "#ac5858",
    marginTop: 0,
    marginBottom: 0,
    fontSize: "6.6vw"
  }
}))

export default function DefaultLayout({children}) {
  const classes = useStyles();
  const webId = useWebId()
  const { inboxContainer, profileDocument, cultDocument, passportDocument } = useModel(webId)
  const [ inboxContainerDoc ] = useDocument(inboxContainer)

  const inbox = inboxContainerDoc && inboxContainerDoc.getSubject(inboxContainerDoc.asRef())
  const notifications = inbox && inbox.getAllRefs(ldp.contains)

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <header className="App-header">
          <h1 className={classes.logo}>cultbook</h1>
        </header>
      </Grid>
      <Grid item xs={12}>
        {notifications && (
          <>
            <h3>Notifications</h3>
            {notifications.map(notification => (
              <Notification uri={notification}/>
            ))}
          </>
        )}
      </Grid>
      {children}
    </Grid>
  )
}
