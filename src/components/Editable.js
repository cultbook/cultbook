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
