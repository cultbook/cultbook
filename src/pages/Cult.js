import React from 'react'

import { useParams } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useWebId } from "@solid/react"

import DefaultLayout from "../layouts/Default"
import { useCultByRef, useCurrentUserIsWWWCult, usePassport } from "../data"
import { useModel } from "../model"

const useStyles = makeStyles(theme => ({
  ritual: {
    textAlign: "center"
  },
  gathering: {
    textAlign: "center"
  },
  rule: {
    textAlign: "center"
  }
}))


export function CultPageByEncodedRef() {
  const { encodedCultRef } = useParams()
  return (
    <CultPage cultRef={decodeURIComponent(encodedCultRef)} />
  )
}

function CultBookmarker({cult}){
  const webId = useWebId()
  const { passportDocument } = useModel(webId)
  const [passport] = usePassport(passportDocument)
  const bookmarkCult = () => {
    passport.addKnown(cult.asRef())
    passport.save()
  }
  return <Button onClick={bookmarkCult}>Bookmark</Button>
}


export default function CultPage({cultRef}){
  const classes = useStyles();
  const [cult] = useCultByRef(cultRef)
  const rituals = cult && cult.rituals
  const gatherings = cult && cult.gatherings
  const rules = cult && cult.rules

  const currentUserIsWWWCult = useCurrentUserIsWWWCult()
  return (
    <DefaultLayout>
      <Grid item xs={12}>
        <Typography variant="h1">{cult && cult.name}</Typography>
        {currentUserIsWWWCult && <CultBookmarker cult={cult}/>}
      </Grid>
      <Grid item xs={12}>
        {rituals && (
          <>
            <Typography variant="h2">Rituals</Typography>
            <List>
              {rituals.map(ritual => (
                <ListItem key={ritual.asRef()} className={classes.ritual}>
                  <ListItemText
                    primary={ritual.name}
                    secondary={ritual.description}
                  >
                  </ListItemText>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Grid>
      <Grid item xs={12}>
        {rules && (
          <>
            <Typography variant="h2">Rules</Typography>
            <List>
              {rules.map(rule => (
                <ListItem key={rule.asRef()} className={classes.rule}>
                  <ListItemText
                    primary={rule.name}
                    secondary={rule.description}
                  >
                  </ListItemText>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Grid>
      <Grid item xs={12}>
        {gatherings && (
          <>
            <Typography variant="h2">Gatherings</Typography>
            <List>
              {gatherings.map(gathering => (
                <ListItem key={gathering.asRef()} className={classes.gathering}>
                  <ListItemText
                    primary={gathering.name}
                    secondary={gathering.description}
                  >
                  </ListItemText>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Grid>
    </DefaultLayout>
  )
}
