import React, {useState} from 'react'

import { makeStyles } from '@material-ui/core/styles';

import { Form, Formik } from 'formik';
import { TextField } from "../components/form"
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  name: {
    '&:hover': {
      color: '#f00',
    },
    cursor: 'pointer',
  },
}))

export function EditableName({entity, schema, variant}){
  const classes = useStyles();
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
    <Typography variant={variant || "h5"} className={classes.name} onClick={() => setEditing(true)}>
      {name || "click to set name"}
    </Typography>
  )
}

export function EditableDescription({entity, schema, variant}){
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
        <TextField multiline name="description" type="text" placeholder="description" autoFocus/>
        <Button type="submit">save</Button>
      </Form>
    </Formik>
  ) : (
    <Typography variant={variant || "body1"} onClick={() => setEditing(true)}>
      {description || "click to set description"}
    </Typography>
  )
}

export function EditableBackstory({entity, schema, variant}){
  const [editing, setEditing] = useState(false)
  const backstory = entity && entity.backstory
  const setBackstory = async (newBackstory) => {
    if (backstory !== newBackstory) {
      entity.backstory = newBackstory
      await entity.save()
    }
    setEditing(false)
  }
  return editing ? (
    <Formik
      initialValues={{backstory: backstory || ""}}
      onSubmit={({backstory}) => { setBackstory(backstory) }}
      validationSchema={schema}
    >
      <Form>
        <TextField multiline name="backstory" type="text" placeholder="backstory" autoFocus/>
        <Button type="submit">save</Button>
      </Form>
    </Formik>
  ) : (
    <Typography variant={variant || "body1"} onClick={() => setEditing(true)}>
      {backstory || "click to set backstory"}
    </Typography>
  )
}
