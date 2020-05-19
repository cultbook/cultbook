import React, {useState} from 'react'

import { useWebId } from "@solid/react"
import { Form, Formik } from 'formik';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import DefaultLayout from "../layouts/Default"
import { useModel } from "../model"
import { useCult } from "../data"
import * as urls from "../urls"
import ButtonLink from "../components/ButtonLink"
import { TextField } from "../components/form"
import { AddMemberSchema, CultSchema, RitualSchema, RuleSchema } from "../validations"
import { inviteMember } from "../services"


const useStyles = makeStyles(theme => ({
}))

function EditableName({entity, schema}){
  const [editing, setEditing] = useState(false)
  const name = entity && entity.name
  const setName = async (newName) => {
    if (name !== newName) {
      entity.name = newName
      await entity.save()
    }
    setEditing(false)
  }
  return editing ? (
    <Formik
      initialValues={{name: name || ""}}
      onSubmit={({name}) => { setName(name) }}
      validationSchema={schema}
    >
      <Form>
        <TextField name="name" type="text" placeholder="name" autoFocus/>
        <Button type="submit">save</Button>
      </Form>
    </Formik>
  ) : (
    <h3 onClick={() => setEditing(true)}>
      {name || "click to set name"}
    </h3>
  )
}

function EditableDescription({entity, schema}){
  const [editing, setEditing] = useState(false)
  const description = entity && entity.description
  const setDescription = async (newDescription) => {
    if (description !== newDescription) {
      entity.description = newDescription
      await entity.save()
    }
    setEditing(false)
  }
  return editing ? (
    <Formik
      initialValues={{description: description || ""}}
      onSubmit={({description}) => { setDescription(description) }}
      validationSchema={schema}
    >
      <Form>
        <TextField name="description" type="text" placeholder="description" autoFocus/>
        <Button type="submit">save</Button>
      </Form>
    </Formik>
  ) : (
    <p onClick={() => setEditing(true)}>
      {description || "click to set description"}
    </p>
  )
}

function EditableCultMembers({cult}){
  const members = cult && cult.members
  const addMember = async (memberWebId) => {
    cult.addMember(memberWebId)
    await cult.save()
    await inviteMember(memberWebId, cult.asRef())
  }
  const removeMember = async (memberWebId) => {
    cult.removeMember(memberWebId)
    await cult.save()
  }
  return (
    <>
      <h4>Members</h4>
      <Formik
        initialValues={{member: ""}}
        onSubmit={({member}) => {addMember(member)}}
        validationSchema={AddMemberSchema}
      >
        <Form>
          <TextField name="member" type="text" placeholder="webid"/>
          <Button type="submit">Add a Member</Button>
        </Form>
      </Formik>
      {members && (
        <ul>
          {members.map(member => (
            <li key={member}>
              {member}
              <Button onClick={() => removeMember(member)}>
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}


function EditableCultRituals({cult}){
  const rituals = cult && cult.rituals
  const addRitual = async (name, description) => {
    cult.addRitual(name, description)
    await cult.save()
  }
  const removeRitual = async (ritual) => {
    cult.removeRitual(ritual)
    await cult.save()
  }
  const submitAddRitual = async ({name, description}, {resetForm}) => {
    await addRitual(name, description)
    resetForm()
  }
  return (
    <>
      <h4>Rituals</h4>
      <Formik
        initialValues={{name: "", description: ""}}
        onSubmit={submitAddRitual}
        validationSchema={RitualSchema}
      >
        <Form>
          <TextField name="name" type="text" placeholder="name"/>
          <TextField name="description" type="text" placeholder="description"/>
          <Button type="submit">Add a Ritual</Button>
        </Form>
      </Formik>
      {rituals && (
        <ul>
          {rituals.map(ritual => (
            <li key={ritual.asRef()}>
              <EditableName entity={ritual} schema={RitualSchema}/>
              <EditableDescription entity={ritual} schema={RitualSchema}/>
              <Button onClick={() => removeRitual(ritual)}>
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

function EditableCultRules({cult}){
  const rules = cult && cult.rules
  const addRule = async (name, description) => {
    cult.addRule(name, description)
    await cult.save()
  }
  const removeRule = async (rule) => {
    cult.removeRule(rule)
    await cult.save()
  }
  const submitAddRule = async ({name, description}, {resetForm}) => {
    await addRule(name, description)
    resetForm()
  }
  return (
    <>
      <h4>Rules</h4>
      <Formik
        initialValues={{name: "", description: ""}}
        onSubmit={submitAddRule}
        validationSchema={RuleSchema}
      >
        <Form>
          <TextField name="name" type="text" placeholder="name"/>
          <TextField name="description" type="text" placeholder="description"/>
          <Button type="submit">Add a Rule</Button>
        </Form>
      </Formik>
      {rules && (
        <ul>
          {rules.map(rule => (
            <li key={rule.asRef()}>
              <EditableName entity={rule} schema={RuleSchema}/>
              <EditableDescription entity={rule} schema={RuleSchema}/>
              <Button onClick={() => removeRule(rule)}>
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

function CultInfo({cult}){
  return (
    <>
      <Grid item xs={12}>
        <EditableName entity={cult} schema={CultSchema}/>
      </Grid>
      <Grid item xs={12}>
        <EditableDescription entity={cult} schema={CultSchema}/>
      </Grid>
      <Grid item xs={12}>
        <EditableCultRituals cult={cult} />
      </Grid>
      <Grid item xs={12}>
        <EditableCultRules cult={cult} />
      </Grid>
      <Grid item xs={12}>
        <EditableCultMembers cult={cult}/>
      </Grid>
    </>
  )
}

export default function MePage(){
  const classes = useStyles();
  const webId = useWebId()
  const { cultDocument, cultPrivateDocument } = useModel(webId)
  const [ cult ] = useCult(cultDocument, cultPrivateDocument)
  return (
    <DefaultLayout>
      <Grid item xs={12}>
        <h2>Your Cult</h2>
      </Grid>
      <Grid item xs={12}>
        <ButtonLink to={urls.cult(cult)}>Public Page</ButtonLink>
      </Grid>
      {cult && <CultInfo cult={cult} />}
    </DefaultLayout>
  )
}
