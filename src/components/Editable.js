import React, {useState} from 'react'

import { Form, Formik } from 'formik';
import { TextField } from "../components/form"
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

export function EditableName({entity, schema, variant}){
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
    <Typography variant={variant || "h5"} onClick={() => setEditing(true)}>
      {name || "click to set name"}
    </Typography>
  )
}
