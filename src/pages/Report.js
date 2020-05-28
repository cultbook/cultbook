import React, {useState} from 'react'

import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useWebId } from "@solid/react"
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import CopyLinkIcon from '@material-ui/icons/FileCopy';
import copy from 'copy-to-clipboard';

import DefaultLayout from "../layouts/Default"
import { useModel } from "../model"
import { useCult, useProfileByWebId, usePassport } from "../data"
import MyCultLink from "../components/MyCultLink"
import CultLink from "../components/CultLink"
import { EditableName } from "../components/Editable"
import { ReportSchema } from "../validations"
import Scene from "../components/Scene"
import ButtonLink from "../components/ButtonLink"
import { Form, Formik } from 'formik';
import { TextField } from "../components/form"
import Link from "../components/Link"
import * as urls from "../urls"
import { sendReportToWWW } from "../services"
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  form: {
//    width: "100%"
  },
  message: {
//    display: "block",
//    width: "100%"
  }
}))

export default function Report(){
  const [submitted, setSubmitted] = useState(false)
  const classes = useStyles();
  const webId = useWebId()
  const sendReport = async ({message}) => {
    await sendReportToWWW(webId, message)
    setSubmitted(true)
  }
  const history = useHistory()
  const goBack = () => {
    history.goBack()
  }
  return (
    <DefaultLayout>
      {submitted ? (
        <>
          <Grid item xs={12}>
            <Scene>
              The air warms and the presence departs, carrying your message to the Cult of www
            </Scene>
          </Grid>
          <Grid item xs={12}>
            <Button onClick={goBack}>Return from Whence You Came</Button>
          </Grid>
        </>
      ) : (
        <>
      <Grid item xs={12}>
        <Scene>
          The air cools and something seems to flit around at the edge of your vision.
        </Scene>
        <Scene>
          Seeing without seeing, hearing without hearing, the presence speaks to you:
        </Scene>
        <Scene>
          Thank you for your diligence, traveler. What do you wish to report to the Cult of www?
        </Scene>
      </Grid>
      <Grid item xs={3}>
      </Grid>
      <Grid item xs={6}>
        <Formik
          initialValues={{message: ""}}
          onSubmit={sendReport}
          validationSchema={ReportSchema}
        >
          <Form className={classes.form}>
            <TextField multiline fullWidth
                       name="message" type="text" placeholder="what would you like to report?" autoFocus
                       className={classes.message}/>
            <Button type="submit">submit report</Button>
          </Form>
        </Formik>
      </Grid>
      <Grid item xs={3}>
      </Grid>
        </>
      )}
    </DefaultLayout>
  )
}
