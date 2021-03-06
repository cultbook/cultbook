import React, {useState} from 'react'

import { useWebId } from "@solid/react"
import { Form, Formik } from 'formik';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import CopyLinkIcon from '@material-ui/icons/FileCopy';
import copy from 'copy-to-clipboard';

import DefaultLayout from "../layouts/Default"
import { useModel } from "../model"
import { useCult, useDocumentExists, usePassport } from "../data"
import * as urls from "../urls"
import ButtonLink from "../components/ButtonLink"
import Link from "../components/Link"
import Linkify from "../components/Linkify"
import Datepicker from "../components/Datepicker"
import ProfileLink from "../components/ProfileLink"
import { TextField } from "../components/form"
import { EditableName, EditableDescription } from "../components/Editable"
import { AddMemberSchema, CultSchema, RitualSchema, RuleSchema, GatheringSchema } from "../validations"
import { inviteMember } from "../services"


const useStyles = makeStyles(theme => ({
  quadrant: {
    border: "15px solid rgba(220, 20, 60, 0.25)",
    borderStyle: "outset",
    marginTop: "20px",
  },
}))


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
        <TextField multiline name="location" type="text" placeholder="location" autoFocus/>
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
  const [adding, setAdding] = useState(false)
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
    setAdding(false)
  }
  return (
    <>
      <Typography variant="h4">Rituals</Typography>
      <Typography variant="body1">
        Ask your followers to perform rituals and upload photographic evidence of their completion.
      </Typography>
      <Button onClick={() => setAdding(!adding)}>Add a Ritual</Button>
      {adding && (
        <Formik
          initialValues={{name: "", description: ""}}
          onSubmit={submitAddRitual}
          validationSchema={RitualSchema}
        >
          <Form>
            <Box>
              <TextField name="name" type="text" placeholder="name"/>
            </Box>
            <Box>
              <TextField multiline name="description" type="text" placeholder="description"/>
            </Box>
            <Button type="submit">Create</Button>
          </Form>
        </Formik>
      )}
      {rituals && (
        <List>
          {rituals.map(ritual => (
            <ListItem key={ritual.asRef()}>
              <Grid container alignItems="center">
                <Grid item xs={6}>
                  <Box>
                    <EditableName entity={ritual} schema={RitualSchema}/>
                  </Box>
                  <Box>
                    <EditableDescription entity={ritual} schema={RitualSchema}/>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <ButtonLink to={urls.ritual(ritual)}>
                    View Performances
                  </ButtonLink>
                </Grid>
                <Grid item xs={3}>
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
  const [adding, setAdding] = useState(false)
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
    setAdding(false)
  }
  return (
    <>
      <Typography variant="h4">Rules</Typography>
      <Typography variant="body1">
        Ask that your followers swear to abide by your rules.
      </Typography>
      <Button onClick={() => setAdding(!adding)}>Add a Rule</Button>
      {adding && (
        <Formik
          initialValues={{name: "", description: ""}}
          onSubmit={submitAddRule}
          validationSchema={RuleSchema}
        >
          <Form>
            <Box>
              <TextField name="name" type="text" placeholder="name"/>
            </Box>
            <Box>
              <TextField multiline name="description" type="text" placeholder="description"/>
            </Box>
            <Button type="submit">Create Rule</Button>
          </Form>
        </Formik>
      )}
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
  const removeGathering = async (gathering) => {
    cult.removeGathering(gathering)
    await cult.save()
  }
  const [adding, setAdding] = useState(false)
  const submitAddGathering = async ({name, description, location, time}, {resetForm}) => {
    cult.addGathering(name, description, location, time)
    await cult.save()
    resetForm()
    setAdding(false)
  }
  return (
    <>
      <Typography variant="h4">Gatherings</Typography>
      <Typography variant="body1">
        Pick a time, place, and reason for your followers to gather.
      </Typography>
      <Button onClick={() => setAdding(!adding)}>Add a Gathering</Button>
      {adding && (
        <Formik
          initialValues={{name: "", description: "", location: "", time: new Date()}}
          onSubmit={submitAddGathering}
          validationSchema={GatheringSchema}
        >
          <Form>
            <Box>
              <TextField name="name" type="text" placeholder="name"/>
            </Box>
            <Box>
              <TextField multiline name="description" type="text" placeholder="description"/>
            </Box>
            <Box>
              <TextField multiline name="location" type="text" placeholder="location" />
              <Box>
                <Typography variant="h6">suggested locations</Typography>
                <Typography variant="body1">https://cultbook.topia.io</Typography>
                <Typography variant="body1">#cultbook on Discord</Typography>
              </Box>
            </Box>
            <Box>
              <Datepicker name="time" showTimeSelect inline openToDate={new Date()}
              />
            </Box>
            <Button type="submit">Announce</Button>
          </Form>
        </Formik>
      )}
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
  const webId = useWebId()
  const members = cult && cult.members
  const addMember = async (memberWebId) => {
    await cult.addAndInviteMember(memberWebId)
  }
  const removeMember = async (memberWebId) => {
    cult.removeMember(memberWebId)
    await cult.save()
  }
  return (
    <>
      <Typography variant="h4">Members</Typography>
      {false && cult && (!cult.isFull) && (
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
      )}
      {members && (
        <List>
          {members.map(member => (
            (member !== webId) && (
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
            )
          ))}
        </List>
      )}
    </>
  )
}



function CultInfo({cult, passport}){
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
  const publicCultLink = cult && new URL(urls.cult(cult), urls.baseUrl()).toString()
  return (
    <>
      <Grid item xs={12}>
        <EditableName entity={cult} schema={CultSchema} variant="h1"/>
      </Grid>
      <Grid item xs={12}>
        <EditableDescription entity={cult} schema={CultSchema}/>
      </Grid>
      <Grid item xs={12}>
        <Grid item xs={12}>
          {passport && passport.veilRemoved && cult && (
            <Link href={cult.asRef()} target="_blank">
              View the source of {cult.name}
            </Link>
          )}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h5">
          <Link to={urls.cult(cult)}>Sharable Link</Link>
          <Tooltip title="Copy to Clipboard" aria-label="copy to clipboard">
            <IconButton onClick={() => {copy(publicCultLink)}}>
              <CopyLinkIcon/>
            </IconButton>
          </Tooltip>
        </Typography>
        <Typography variant="body1">
          Send this link to new recruits
        </Typography>
      </Grid>
      <Grid item className={classes.quadrant} xs={12} md={5}>
        <EditableCultRituals cult={cult} />
      </Grid>
      <Grid item className={classes.quadrant} xs={12} md={5}>
        <EditableCultRules cult={cult} />
      </Grid>
      <Grid item className={classes.quadrant} xs={12} md={5}>
        <EditableCultGatherings cult={cult} />
      </Grid>
      <Grid item className={classes.quadrant} xs={12} md={5}>
        <EditableCultMembers cult={cult}/>
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
  const { cultDocument, cultPrivateDocument, passportDocument } = useModel(webId)
  const [ cult ] = useCult(cultDocument, cultPrivateDocument)
  const [ passport ] = usePassport(passportDocument)
  return (
    <DefaultLayout>
      {cult && <CultInfo cult={cult} passport={passport} />}
    </DefaultLayout>
  )
}
