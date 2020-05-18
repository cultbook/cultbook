import React from 'react'

import { makeStyles } from '@material-ui/core/styles';

import DefaultLayout from "../layouts/Default"

import { useWebId } from "@solid/react"
import { rdfs, foaf, vcard, ldp } from 'rdf-namespaces'
import { Form, Formik } from 'formik';
import { describeDocument } from "plandoc"
import Button from '@material-ui/core/Button';

import { as } from "../vocab"
import { useModel, cb, Cult, Rule, Ritual } from "../model"
import { useDocument, useCult, usePassport } from "../data"
import LogoutButton from "../components/LogoutButton"
import { TextField } from "../components/form"
import { AddFollowerSchema, CultSchema, RitualSchema, RuleSchema } from "../validations"
import { inviteFollower, deleteNotification } from "../services"


const useStyles = makeStyles(theme => ({
}))

export default function MePage(){
  const classes = useStyles();
  const webId = useWebId()
  const { inboxContainer, profileDocument, cultDocument, passportDocument } = useModel(webId)
  const [ cult ] = useCult(cultDocument)
  return (
    <DefaultLayout>
    </DefaultLayout>
  )
}
