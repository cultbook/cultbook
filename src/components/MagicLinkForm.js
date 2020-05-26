import React, {useState, useEffect} from 'react'

import { useAuthContext } from "../context/auth"
import { EmailSchema } from "../validations"
import { Form, Formik } from 'formik';
import { TextField } from "../components/form"
import Button from '@material-ui/core/Button';

export default function MagicLinkForm({onEmailSubmit}){
  const [email, setEmail] = useState("")
  const { sendMagicLink } = useAuthContext()
  async function sendEmail({email}) {
    onEmailSubmit(email)
    await sendMagicLink(email)
  }

  return (
    <Formik
      initialValues={{email: email || ""}}
      onSubmit={sendEmail}
      validationSchema={EmailSchema}
    >
      <Form>
        <TextField name="email" type="email" placeholder="add your email to the list" autoFocus/>
        <Button type="submit">submit</Button>
      </Form>
    </Formik>
  )
}
