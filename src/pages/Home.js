import React from 'react'

import { makeStyles } from '@material-ui/core/styles';
import { useWebId } from "@solid/react"
import { foaf } from 'rdf-namespaces'

import LoginButton from "../components/LoginButton"
import { useModel } from "../model"
import { useDocument } from "../data"

const useStyles = makeStyles(theme => console.log(theme) || ({
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
  console.log(profileDoc)
  console.log(profileDoc && profileDoc.getSubject(webId).getString(foaf.name))
  return (
    <header className="App-header">
      <h1 className={classes.logo}>cultbook</h1>
      <h2>
        Welcome, {profileDoc && profileDoc.getSubject(webId).getString(foaf.name)}
      </h2>
    </header>
  )
}