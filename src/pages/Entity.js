import React from 'react'

import { useParams } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import { useWebId } from "@solid/react"

import * as urls from "../urls"
import DefaultLayout from "../layouts/Default"
import { useProfile, useCult, usePassport, useRules, useGatherings, usePerformance, useCultByWebId, useImage } from "../data"
import { useModel } from "../model"
import Link from "../components/Link"
import CultLink from "../components/CultLink"
import Loader from "../components/Loader"
import ButtonLink from "../components/ButtonLink"
import {PerformanceByUri} from "../components/Performance"

const useStyles = makeStyles(theme => ({
  quadrant: {
    border: "3px solid rgba(220, 20, 60, 0.25)",
    borderStyle: "outset",
    marginTop: "20px",
  },
}))


export function EntityPageByEncodedRef() {
  const { encodedRef } = useParams()
  return (
    <EntityPage entityWebId={decodeURIComponent(encodedRef)} />
  )
}

function Rule({rule}){
  return (
    <>
      <Typography variant="h5">
        {rule.name}
      </Typography>
    </>
  )
}

function Gathering({gathering}){
  return (
    <>
      <Typography variant="h5">
        {gathering.name}
      </Typography>
    </>
  )
}

export default function EntityPage({entityWebId}){
  const classes = useStyles();
  const webId = useWebId()
  const {cultDocument: myCultDocument, cultPrivateDocument: myCultPrivateDocument, passportDocument: myPassportDocument} = useModel(webId)
  const [myCult] = useCult(myCultDocument, myCultPrivateDocument)
  const [ myPassport ] = usePassport(myPassportDocument)
  const {profileDocument, passportDocument, cultDocument, cultPrivateDocument} = useModel(entityWebId)
  const [entity] = useProfile(profileDocument)
  const [passport] = usePassport(passportDocument)
  const [rules] = useRules(passport)
  const [gatherings] = useGatherings(passport)
  const [cult] = useCult(cultDocument, cultPrivateDocument)
  const addToMyCult = async () => {
    await myCult.addAndInviteMember(entity.asRef())
  }
  return (
    <DefaultLayout>
      <Grid item xs={12}>
        <Typography variant="h1">{entity && (entity.name || "an unnamed soul")}</Typography>
        <Typography variant="body1">{entity && (entity.description || "a forgettable figure")}</Typography>
        <Typography variant="body1">{entity && (entity.backstory || "of no particular reknown")}</Typography>
        {myPassport && myPassport.veilRemoved && (
          <Link href={entity && entity.asRef()} target="_blank">Look behind the veil</Link>
        )}
      </Grid>
      <Grid item xs={12}>
        {entity && myCult && !myCult.hasMember(entity.asRef()) && !myCult.isFull && (
          <Button onClick={addToMyCult}>
            Add {entity.name} to {myCult.name}
          </Button>
        )}
      </Grid>
      <Grid item xs={12}>
        {cult && (
          <>
            {(myPassport.isFollowing(cult) || (webId === cult.ownerWebId))? (
              <ButtonLink to={urls.cultByRef(cult.asRef())}>Enter Lair of {cult.name}</ButtonLink>
            ) : (
              <Button onClick={() => myPassport.followAndApplyToJoin(cult, webId)}>Apply to Join {cult.name}</Button>
            )}

          </>
        )}
      </Grid>
      <Grid item xs={12} md={5} className={classes.quadrant}>
        {gatherings && (
          <>
            <Typography variant="h3">Attending</Typography>
            {(gatherings.length === 0) &&
              <Typography variant="h6">
                Alone and nowhere to go...
              </Typography>
            }
            {gatherings.map(gathering => (
              <Gathering gathering={gathering} key={gathering.asRef()}/>
            ))}
          </>
        )}
      </Grid>
      <Grid item xs={12} md={5} className={classes.quadrant}>
        {rules && (
          <>
            <Typography variant="h3">Oaths Sworn</Typography>
            {(rules.length === 0) &&
              <Typography variant="h6">
                {entity && entity.name} follows no rules... not even their own.
              </Typography>
            }
            {rules.map(rule => (
              <Rule rule={rule} key={rule.asRef()}/>
            ))}
          </>
        )}
      </Grid>
      <Grid item xs={12} md={5} className={classes.quadrant}>
        {passport && passport.following && (
          <>
            <Typography variant="h3">Cults Followed</Typography>
            <List>
              {(passport.following.length === 0) &&
                <Typography variant="h6">
                  {entity.name} is truly a lone wolf.
                </Typography>
              }
              {passport.following.map(cultRef => (
                <CultLink cultRef={cultRef} key={cultRef}/>
              ))}
            </List>
          </>
        )}
      </Grid>
      <Grid item xs={12} md={5} className={classes.quadrant}>
        {passport && passport.performances && (
          <>
            <Typography variant="h3">Performances</Typography>
            {passport.performances.map(performance => (
              <PerformanceByUri uri={performance} key={performance}/>
            ))}
          </>
        )}
        {(!passport || passport.performances.length === 0) &&
          <Typography variant="h6">
            Performance schedule empty as the void.
          </Typography>
        }
      </Grid>
    </DefaultLayout>
  )
}
