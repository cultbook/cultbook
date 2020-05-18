import React, { useMemo, useState } from 'react'

import { useWebId } from "@solid/react"
import { rdfs, foaf, vcard, ldp } from 'rdf-namespaces'
import { Form, Formik } from 'formik';
import { describeDocument } from "plandoc"

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import { as } from "../vocab"
import { useModel, cb, Cult, Rule, Ritual } from "../model"
import { useDocument, useCult, usePassport } from "../data"
import LogoutButton from "../components/LogoutButton"
import Link from "../components/Link"
import ButtonLink from '../components/ButtonLink'
import { TextField } from "../components/form"
import DefaultLayout from "../layouts/Default"
import { AddFollowerSchema, CultSchema, RitualSchema, RuleSchema } from "../validations"
import { inviteFollower, deleteNotification } from "../services"

const useStyles = makeStyles(theme => ({
}))

export default function HomePage(){
  const classes = useStyles();
  const webId = useWebId()
  const { inboxContainer, profileDocument, cultDocument, passportDocument } = useModel(webId)

  const [ profileDoc ] = useDocument(profileDocument)
  const [ inboxContainerDoc ] = useDocument(inboxContainer)

  const inbox = inboxContainerDoc && inboxContainerDoc.getSubject(inboxContainerDoc.asRef())
  const notifications = inbox && inbox.getAllRefs(ldp.contains)

  const [ passport, savePassport ] = usePassport(passportDocument)
  const following = passport && passport.getAllRefs(cb.follows)

  return (
    <DefaultLayout>
      <Grid item xs={12}>
        <h2>
          Welcome, {profileDoc && profileDoc.getSubject(webId).getString(foaf.name)}
        </h2>
      </Grid>
      <Grid item xs={12}>
        <ButtonLink to="/me">Me</ButtonLink>
      </Grid>
      <Grid item xs={12}>
        <ButtonLink to="/me/cult">My Cult</ButtonLink>
      </Grid>
      <Grid item xs={12}>
        {following && (
          <>
            <h2>Cults You Follow</h2>
            <ul>
              {following.map(cult => (
              <li>{cult.toString()}</li>
              ))}
            </ul>
          </>
        )}
      </Grid>
      <Grid item xs={12}>
        <LogoutButton/>
      </Grid>
    </DefaultLayout>
  )
}
