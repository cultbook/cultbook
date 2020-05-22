import React, { useState, useEffect, useMemo } from 'react'

import { useWebId } from "@solid/react"

import { useParams } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { ldp } from 'rdf-namespaces'

import DefaultLayout from "../layouts/Default"
import { useDocument, useProfile, useRitualByRef, useCurrentUserIsWWWRitual, usePassport, usePerformance, useProfileByWebId } from "../data"
import { useModel } from "../model"
import Linkify from "../components/Linkify"
import Link from "../components/Link"
import ImageUploader from "../components/ImageUploader"
import Loader from "../components/Loader"
import ProfileLink from "../components/ProfileLink"
import { createPrivateCultResourceAcl } from "../utils/acl"
import { deleteDocument, documentExists } from "../services"

const useStyles = makeStyles(theme => ({
}))


export function EntityPageByEncodedRef() {
  const { encodedRef } = useParams()
  return (
    <EntityPage entityWebId={decodeURIComponent(encodedRef)} />
  )
}

function Performance({uri}){
  const webId = useWebId()
  const [performance] = usePerformance(uri)
  return performance ? (
    <img src={performance.object} alt={performance.title}/>
  ) : (
    <Loader/>
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

export default function EntityPage({entityWebId}){
  const classes = useStyles();
  const {profileDocument, passportDocument} = useModel(entityWebId)
  const [entity] = useProfile(profileDocument)
  const [passport] = usePassport(passportDocument)
  const [rules, setRules] = useState()
  useEffect(() => {
    if (passport){
      async function loadRules(){
        setRules(await passport.getRules())
      }
      loadRules()
    }
  }, [passport])
  return (
    <DefaultLayout>
      <Grid item xs={12}>
        <Typography variant="h1">{entity && entity.name}</Typography>
        <Link href={entity && entity.asRef()} target="_blank">Look behind the veil</Link>
      </Grid>
      <Grid item xs={12}>
        {rules && (
          <>
            <Typography variant="h3">Oaths Sworn</Typography>
            {rules.map(rule => (
              <Rule rule={rule} key={rule.asRef()}/>
            ))}
          </>
        )}
      </Grid>
      <Grid item xs={12}>
        {passport && passport.performances && (
          <>
            <Typography variant="h3">Performances</Typography>
            {passport.performances.map(performance => (
              <Performance uri={performance} key={performance}/>
            ))}
          </>
        )}
      </Grid>
    </DefaultLayout>
  )
}
