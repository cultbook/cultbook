import React from 'react'

import { makeStyles } from '@material-ui/core/styles';
import { useWebId } from "@solid/react"
import { foaf } from 'rdf-namespaces'

import { useModel } from "../model"
import { useDocument } from "../data"
import LogoutButton from "../components/LogoutButton"

const useStyles = makeStyles(theme => ({
  logo: {
    fontFamily: "gothicus, serif",
    color: "#ac5858",
    marginTop: 0,
    marginBottom: 0,
    fontSize: "6.6vw"
  }
}))

export default function HomePage(){
  const classes = useStyles();
  const webId = useWebId()
  const { profile } = useModel(webId)
  const [ profileDoc ] = useDocument(profile)
  return (
    <>
      <header className="App-header">
        <h1 className={classes.logo}>cultbook</h1>
      </header>
      <h2>
        Welcome, {profileDoc && profileDoc.getSubject(webId).getString(foaf.name)}
      </h2>
      <LogoutButton/>
    </>
  )
}
