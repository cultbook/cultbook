import React from 'react'

import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useWebId } from "@solid/react"

import DefaultLayout from "../layouts/Default"
import { useModel } from "../model"
import { useCult, useProfileByWebId, usePassport } from "../data"
import MyCultLink from "../components/MyCultLink"
import CultLink from "../components/CultLink"
import { EditableName } from "../components/Editable"
import { ProfileSchema } from "../validations"
import Scene from "../components/Scene"
import ButtonLink from "../components/ButtonLink"
import * as urls from "../urls"

const useStyles = makeStyles(theme => ({
  cultLink: {
    margin: "auto"
  }
}))

export default function MePage(){
  const classes = useStyles();
  const webId = useWebId()
  const { cultDocument, cultPrivateDocument, passportDocument } = useModel(webId)
  const [ cult ] = useCult(cultDocument, cultPrivateDocument)
  const [ passport ] = usePassport(passportDocument)
  const [ profile ] = useProfileByWebId(webId)
  return (
    <DefaultLayout>
      <Grid item xs={12}>
        <Scene>
          You look into a ancient mirror and gaze upon the visage of
        </Scene>
      </Grid>
      <Grid item xs={12}>
        {profile && <EditableName entity={profile} schema={ProfileSchema} variant="h1"/>}
      </Grid>
      <Grid item xs={12}>
        {profile && <ButtonLink to={urls.profileByRef(profile.asRef())}>Public Profile</ButtonLink>}
      </Grid>
      <Grid item xs={12}>
        <ButtonLink to="/">Direct your attention elsewhere</ButtonLink>
      </Grid>
      <Grid item xs={12}>
        {cult && <MyCultLink cult={cult}/>}
      </Grid>
      <Grid item xs={12}>
        {passport && (
          <>
            <Typography variant="h3">Cults You Follow</Typography>
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
    </DefaultLayout>
  )
}
