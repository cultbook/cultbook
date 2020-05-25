import React, {useState, useEffect} from 'react'

import { useWebId } from "@solid/react"
import { Form, Formik } from 'formik';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import DefaultLayout from "../layouts/Default"
import { useModel } from "../model"
import { useCult, useDocumentExists } from "../data"
import * as urls from "../urls"
import ButtonLink from "../components/ButtonLink"
import Link from "../components/Link"
import Linkify from "../components/Linkify"
import Datepicker from "../components/Datepicker"
import ProfileLink from "../components/ProfileLink"
import { TextField } from "../components/form"
import { EditableName } from "../components/Editable"
import { AddMemberSchema, CultSchema, RitualSchema, RuleSchema, GatheringSchema } from "../validations"
import { inviteMember } from "../services"


const useStyles = makeStyles(theme => ({
  quadrant: {
    border: "3px solid rgba(220, 20, 60, 0.25)",
    borderStyle: "outset",
    marginTop: "20px",
  },
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

function EditableLocation({entity, schema}){
  const [editing, setEditing] = useState(false)
  const location = entity && entity.location
  const setLocation = async (newLocation) => {
    if (location !== newLocation) {
      entity.location = newLocation
      await entity.save()
    }
    setEditing(false)
  }
  return editing ? (
    <Formik
      initialValues={{location: location || ""}}
      onSubmit={({location}) => { setLocation(location) }}
      validationSchema={schema}
    >
      <Form>
        <TextField name="location" type="text" placeholder="location" autoFocus/>
        <Button type="submit">save</Button>
      </Form>
    </Formik>
  ) : (
    <Typography variant="body1" onClick={() => setEditing(true)}>
      {location ? <>we will convene at {<Linkify>{location}</Linkify>}</> : "click to set location"}
    </Typography>
  )
}

function EditableTime({entity, schema}){
  const classes = useStyles()
  const [editing, setEditing] = useState(false)
  const time = entity && entity.time
  const setTime = async (newTime) => {
    if (time !== newTime) {
      entity.time = newTime
      await entity.save()
    }
    setEditing(false)
  }
  return editing ? (
    <Formik
      initialValues={{time: time || ""}}
      onSubmit={({time}) => { setTime(time) }}
      validationSchema={schema}
    >
      <Form>
        <Datepicker name="time" autoFocus showTimeSelect inline
                    openToDate={new Date()}
        />
        <Button type="submit">save</Button>
      </Form>
    </Formik>
  ) : (
    <Typography variant="body1" onClick={() => setEditing(true)}>
      {time ? `at ${time.toLocaleString()}` : "click to set time"}
    </Typography>
  )
}


function EditableCultRituals({cult}){
  const classes = useStyles();
  const rituals = cult && cult.rituals
  const addRitual = async (name, description) => {
    await cult.addRitual(name, description)
  }
  const removeRitual = async (ritual) => {
    await cult.removeRitual(ritual)
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
        <List>
          {rituals.map(ritual => (
            <ListItem key={ritual.asRef()}>
              <Grid container alignItems="center">
                <Grid item xs={9}>
                  <Box>
                    <EditableName entity={ritual} schema={RitualSchema}/>
                  </Box>
                  <Box>
                    <EditableDescription entity={ritual} schema={RitualSchema}/>
                  </Box>
                </Grid>
                <Grid item xs>
                  <Button onClick={() => removeRitual(ritual)}>
                    Delete
                  </Button>
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </List>
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
        <List>
          {rules.map(rule => (
            <ListItem key={rule.asRef()}>
              <Grid container alignItems="center">
                <Grid item xs={9}>
                  <Box>
                    <EditableName entity={rule} schema={RuleSchema}/>
                  </Box>
                  <Box>
                    <EditableDescription entity={rule} schema={RuleSchema}/>
                  </Box>
                </Grid>
                <Grid item xs>
                  <Button onClick={() => removeRule(rule)}>
                    Delete
                  </Button>
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </List>
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
        <List>
          {gatherings.map(gathering => (
            <ListItem key={gathering.asRef()}>
              <Grid container alignItems="center">
                <Grid item xs={9}>
                  <Box>
                    <EditableName entity={gathering} schema={GatheringSchema}/>
                  </Box>
                  <Box>
                    <EditableDescription entity={gathering} schema={GatheringSchema}/>
                  </Box>
                  <Box>
                    <EditableLocation entity={gathering} schema={GatheringSchema}/>
                  </Box>
                  <Box>
                    <EditableTime entity={gathering} schema={GatheringSchema}/>
                  </Box>
                </Grid>
                <Grid item xs>
                  <Button onClick={() => removeGathering(gathering)}>
                    Delete
                  </Button>
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </List>
      )}
    </>
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
        <List>
          {members.map(member => (
            <ListItem key={member}>
              <Grid container alignItems="center">
                <Grid item xs={9}>
                  <ProfileLink webId={member}/>
                </Grid>
                <Grid item xs>
                  <Button onClick={() => removeMember(member)}>
                    Banish
                  </Button>
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </List>
      )}
    </>
  )
}



function CultInfo({cult}){
  const classes = useStyles();
  const [aclCreated, checkingAcl, error, refresh] = useDocumentExists(cult.aclRef)
  async function fixCult(){
    await cult.ensureAcl()
    await cult.ensureOwnerMember()
    refresh()
  }
  const notConfiguredProperly = () => {
    return cult && ((!checkingAcl && !aclCreated) || !cult.isOwnerMember())
  }
  return (
    <>
      <Grid item xs={12}>
        <EditableName entity={cult} schema={CultSchema} variant="h1"/>
      </Grid>
    <Grid item xs={12}>
      <Grid item xs={12}>
        {cult && <Link href={cult.asRef()} target="_blank">View the source of {cult.name}</Link>}
      </Grid>
    </Grid>

      <Grid item xs={12}>
        <EditableDescription entity={cult} schema={CultSchema}/>
      </Grid>
      <Grid item className={classes.quadrant} xs={5}>
        <EditableCultRituals cult={cult} />
      </Grid>
      <Grid item className={classes.quadrant} xs={5}>
        <EditableCultRules cult={cult} />
      </Grid>
      <Grid item className={classes.quadrant} xs={5}>
        <EditableCultGatherings cult={cult} />
      </Grid>
      <Grid item className={classes.quadrant} xs={5}>
        <EditableCultMembers cult={cult}/>
      </Grid>
      <Grid item xs={12}>
        <ButtonLink to={urls.cult(cult)}>Public Page</ButtonLink>
      </Grid>
      {notConfiguredProperly() && (
        <Grid item xs={12}>
          <Typography variant="body1">
            Your cult is not configured properly. You may need to summon the Cult of WWW for assistance.
          </Typography>
          <Button onClick={fixCult}>
            Try to fix it
          </Button>
        </Grid>
      )}
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
