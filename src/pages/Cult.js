import React from 'react'

import { useParams } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { useWebId } from "@solid/react"

import DefaultLayout from "../layouts/Default"
import { useCultByRef, useCurrentUserIsWWWCult, usePassport } from "../data"
import { useModel } from "../model"
import Linkify from "../components/Linkify"
import * as urls from "../urls"
import ButtonLink from "../components/ButtonLink"

const useStyles = makeStyles(theme => ({
  ritual: {
    textAlign: "left"
  },
  gathering: {
    textAlign: "center",
    margin: "auto"
  },
  rule: {
    textAlign: "left"
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
  const webId = useWebId()
  const { passportDocument } = useModel(webId)
  const classes = useStyles();
  const [cult, cultLoading] = useCultByRef(cultRef)
  const rituals = cult && cult.rituals
  const gatherings = cult && cult.gatherings
  const rules = cult && cult.rules

  const [ passport ] = usePassport(passportDocument)

  const swearTo = (rule) => {
    passport.swearTo(rule)
    passport.save()
  }

  const breakOath = (rule) => {
    passport.breakOath(rule)
    passport.save()
  }

  const rsvp = (gathering) => {
    passport.attend(gathering)
    passport.save()
  }

  const cancelPlans = (gathering) => {
    passport.cancelPlans(gathering)
    passport.save()
  }

  const currentUserIsWWWCult = useCurrentUserIsWWWCult()
  return (
    <DefaultLayout>
      <Grid item xs={12}>
        <Typography variant="h1">{cult && cult.name}</Typography>
        {currentUserIsWWWCult && <CultBookmarker cult={cult}/>}
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">{cult && cult.description}</Typography>
      </Grid>
      {!cultLoading && cult && (
        <>
          {
            cult.hasPrivateAccess ? (
              <>
                <Grid item xs={3}/>
                <Grid item xs={6}>
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
                            <ListItemText>
                              <ButtonLink to={urls.ritual(ritual)}>
                                Perform
                              </ButtonLink>
                            </ListItemText>
                          </ListItem>
                  ))}
                </List>
              </>
            )}
          </Grid>
          <Grid item xs={3}/>
          <Grid item xs={3}/>
          <Grid item xs={6}>
            {rules && (
              <>
                <Typography variant="h2">Rules</Typography>
                <List>
                  {rules.map(rule => (
                    <ListItem key={rule.asRef()} className={classes.rule}>
                      <ListItemText
                        primary={rule.name}
                        secondary={rule.description}
                      />
                      {passport && (
                        <ListItemText>
                          {passport.isSwornTo(rule) ? (
                            <Button onClick={() => breakOath(rule)}>
                              Break Your Oath
                            </Button>
                          ) : (
                            <Button onClick={() => swearTo(rule)}>
                              Swear to Obey
                            </Button>
                          )}
                        </ListItemText>
                      )}
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </Grid>
          <Grid item xs={3}/>
          <Grid item xs={12}>
            {gatherings && (
              <>
                <Typography variant="h2">Gatherings</Typography>
                <List>
                  {gatherings.map(gathering => (
                    <ListItem key={gathering.asRef()} className={classes.gatheringListItem}>
                      <Box display="flex" flexDirection="column" className={classes.gathering}>
                        <ListItemText
                          primary={gathering.name}
                          secondary={gathering.description}
                        />
                        <ListItemText>
                          we will convene at&nbsp;
                          <Linkify>{gathering.location}</Linkify>
                        </ListItemText>
                        <ListItemText>
                          at {gathering.time && gathering.time.toLocaleString()}
                        </ListItemText>
                        {passport && (
                          <ListItemText>
                            {passport.isAttending(gathering) ? (
                              <Button onClick={() => cancelPlans(gathering)}>
                                Cancel plans
                              </Button>
                            ) : (
                              <Button onClick={() => rsvp(gathering)}>
                                RSVP
                              </Button>
                            )}
                          </ListItemText>
                        )}
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </Grid>
        </>
            ) : (
              <>
                <Grid item xs={12}>
                  <Typography variant="h5">
                    You do not have access to the mysteries of this cult.
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <ButtonLink to="/cults">Browse more Cults</ButtonLink>
                </Grid>
              </>
            )}
        </>
      )}
    </DefaultLayout>
  )
}
