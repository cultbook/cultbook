import React from 'react'

import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useWebId } from "@solid/react"
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import CopyLinkIcon from '@material-ui/icons/FileCopy';
import copy from 'copy-to-clipboard';

import DefaultLayout from "../layouts/Default"
import { useModel } from "../model"
import { useCult, useProfileByWebId, usePassport } from "../data"
import MyCultLink from "../components/MyCultLink"
import CultLink from "../components/CultLink"
import { EditableName, EditableDescription, EditableBackstory } from "../components/Editable"
import { ProfileSchema } from "../validations"
import Scene from "../components/Scene"
import ButtonLink from "../components/ButtonLink"
import Link from "../components/Link"
import * as urls from "../urls"

const useStyles = makeStyles(theme => ({
  cultLink: {
    margin: "auto"
  },
  quadrant: {
    border: "15px solid rgba(220, 20, 60, 0.4)",
    borderStyle: "outset",
    marginTop: "20px",
  },
}))

export default function MePage(){
  const classes = useStyles();
  const webId = useWebId()
  const { cultDocument, cultPrivateDocument, passportDocument } = useModel(webId)
  const [ cult ] = useCult(cultDocument, cultPrivateDocument)
  const [ passport ] = usePassport(passportDocument)
  const [ profile ] = useProfileByWebId(webId)
  const publicProfileLink = profile && new URL(urls.profile(profile), urls.baseUrl()).toString()
  return (
    <DefaultLayout>
      <Grid item xs={8}>
        <Typography variant="h3">
          You look into an ancient mirror and gaze upon the visage of...
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {profile && <EditableName entity={profile} schema={ProfileSchema} variant="h1"/>}
        {profile && <EditableDescription entity={profile} schema={ProfileSchema} variant="body1"/>}
        {profile && <EditableBackstory entity={profile} schema={ProfileSchema} variant="body1"/>}
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h5">
          <Link to={profile && urls.profile(profile)}>Sharable Link</Link>
          <Tooltip title="Copy to Clipboard" aria-label="copy to clipboard">
            <IconButton onClick={() => {copy(publicProfileLink)}}>
              <CopyLinkIcon/>
            </IconButton>
          </Tooltip>
        </Typography>
      </Grid>
      {cult &&
        <>
          <Grid item xs={3}></Grid>
          <Grid item xs={6} className={classes.quadrant}>
             <Typography variant="h3">The Cult You Lead</Typography>
            <MyCultLink cult={cult}/>
          </Grid>
          <Grid item xs={3}></Grid>
        </>
      }
      <Grid item xs={3}></Grid>
      <Grid item xs={6} className={classes.quadrant}>
        {passport && (
          <>
            <Typography variant="h3">The Cults You Follow</Typography>
            <List>
              {passport.following && passport.following.map(cultRef => (
                <ListItem>
                  <CultLink cultRef={cultRef} className={classes.cultLink}/>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Grid>
      <Grid item xs={3}></Grid>
    </DefaultLayout>
  )
}
