import React, {useState} from 'react'

import { useWebId } from "@solid/react"
import { Form, Formik } from 'formik';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import DefaultLayout from "../layouts/Default"
import { useModel } from "../model"
import { useCult } from "../data"
import * as urls from "../urls"
import ButtonLink from "../components/ButtonLink"
import { TextField } from "../components/form"
import { EditableName } from "../components/Editable"
import { AddMemberSchema, CultSchema, RitualSchema, RuleSchema, GatheringSchema } from "../validations"
import { inviteMember } from "../services"


const useStyles = makeStyles(theme => ({
}))

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
    <Typography variant="body1" onClick={() => setEditing(true)}>
      {description || "click to set description"}
    </Typography>
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
      <Typography variant="h4">Members</Typography>
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
      <Typography variant="h4">Rituals</Typography>
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
      <Typography variant="h4">Rules</Typography>
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

function EditableCultGatherings({cult}){
  const gatherings = cult && cult.gatherings
  const addGathering = async (name, description) => {
    cult.addGathering(name, description)
    await cult.save()
  }
  const removeGathering = async (gathering) => {
    cult.removeGathering(gathering)
    await cult.save()
  }
  const submitAddGathering = async ({name, description}, {resetForm}) => {
    await addGathering(name, description)
    resetForm()
  }
  return (
    <>
      <Typography variant="h4">Gatherings</Typography>
      <Formik
        initialValues={{name: "", description: ""}}
        onSubmit={submitAddGathering}
        validationSchema={GatheringSchema}
      >
        <Form>
          <TextField name="name" type="text" placeholder="name"/>
          <TextField name="description" type="text" placeholder="description"/>
          <Button type="submit">Add a Gathering</Button>
        </Form>
      </Formik>
      {gatherings && (
        <ul>
          {gatherings.map(gathering => (
            <li key={gathering.asRef()}>
              <EditableName entity={gathering} schema={GatheringSchema}/>
              <EditableDescription entity={gathering} schema={GatheringSchema}/>
              <Button onClick={() => removeGathering(gathering)}>
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
        <EditableName entity={cult} schema={CultSchema} variant="h1"/>
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
        <EditableCultGatherings cult={cult} />
      </Grid>
      <Grid item xs={12}>
        <EditableCultMembers cult={cult}/>
      </Grid>
      <Grid item xs={12}>
        <ButtonLink to={urls.cult(cult)}>Public Page</ButtonLink>
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
      {cult && <CultInfo cult={cult} />}
    </DefaultLayout>
  )
}
