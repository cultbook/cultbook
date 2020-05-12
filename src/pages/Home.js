import React from 'react'

import { useWebId } from "@solid/react"
import { foaf } from 'rdf-namespaces'
import { Form, Formik } from 'formik';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { useModel } from "../model"
import { useDocument } from "../data"
import LogoutButton from "../components/LogoutButton"
import { TextField } from "../components/form"
import { AddFollowerSchema } from "../validations"

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
  const { profileDocument, cultDocument } = useModel(webId)
  const [ profileDoc ] = useDocument(profileDocument)
  const [ cultDoc, saveCult ] = useDocument(cultDocument)
  const cult = cultDoc && cultDoc.getSubject(`${cultDoc.asRef()}#cult`)
  const followers = cult && cult.getAllRefs(foaf.member)
  const addFollower = async (follower) => {
    cult.addRef(foaf.member, follower)
    await saveCult()
  }
  const removeFollower = async (follower) => {
    cult.removeRef(foaf.member, follower)
    await saveCult()
  }
  return (
    <>
      <header className="App-header">
        <h1 className={classes.logo}>cultbook</h1>
      </header>
      <h2>
        Welcome, {profileDoc && profileDoc.getSubject(webId).getString(foaf.name)}
      </h2>
      <Formik
        initialValues={{follower: ""}}
        onSubmit={({follower}) => {addFollower(follower)}}
        validationSchema={AddFollowerSchema}
      >
        <Form>
          <TextField name="follower" type="text"/>
          <Button type="submit">Add a Follower</Button>
        </Form>
      </Formik>
      {followers && (
        <>
          <h3>Followers</h3>
          <ul>
            {followers.map(follower => (
              <li key={follower}>
                {follower}
                <Button onClick={() => removeFollower(follower)}>Delete</Button>
              </li>
            ))}
          </ul>
        </>
      )}
      <LogoutButton/>
    </>
  )
}
