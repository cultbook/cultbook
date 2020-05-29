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

import ProfileLink from "../components/ProfileLink"
import ApplyToJoinCultButton from "../components/ApplyToJoinCultButton"
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
  member: {
    "& a": {
      textAlign: "center",
      margin: "auto"
    }
  },
  rule: {
    textAlign: "left"
  },
  quadrant: {
    border: "15px solid rgba(220, 20, 60, 0.25)",
    borderStyle: "outset",
    marginTop: "20px",
  },
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
  const members = cult && cult.members

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
      {cult && (webId === cult.ownerWebId) && (
        <Grid item xs={12}>
          <ButtonLink to="/me/cult">Administer {cult.name}</ButtonLink>
        </Grid>
      )}
      {!cultLoading && cult && (
        <>
          {
            cult.hasPrivateAccess ? (
              <>
                <Grid item xs={12} md={5} className={classes.quadrant}>
                  {rituals && (
                    <>
                      <Typography variant="h2">Rituals</Typography>
                      {(rituals.length === 0) &&
                        <Typography variant="h6">
                          No rituals... the altar yearns for blood.
                        </Typography>
                      }
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
                <Grid item xs={12} md={5} className={classes.quadrant}>
                  {rules && (
                    <>
                      <Typography variant="h2">Rules</Typography>
                      {(rules.length === 0) &&
                        <Typography variant="h6">
                          No rules... no masters.
                        </Typography>
                      }
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
                <Grid item xs={12} md={5} className={classes.quadrant}>
                  {gatherings && (
                    <>
                      <Typography variant="h2">Gatherings</Typography>
                      {(gatherings.length === 0) &&
                        <Typography variant="h6">
                          No gatherings... yet.
                        </Typography>
                      }
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
                <Grid item xs={12} md={5} className={classes.quadrant}>
                  {members && (
                    <>
                      <Typography variant="h2">Members</Typography>
                      {(members.length === 0) &&
                        <Typography variant="h6">
                          No members
                        </Typography>
                      }
                      <List>
                        {members.map(member => (
                          <ListItem className={classes.member} key={member}>
                            <ProfileLink size='large' webId={member}></ProfileLink>
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}
                </Grid>

              </>
            ) : (
              <>
                <Grid item xs={3}/>
                <Grid item xs={6}>
                  <Typography variant="h5">
                    You do not have access to the mysteries of this cult. The cult leader has been notified of your desire to become an initiate.
                  </Typography>
                </Grid>
                <Grid item xs={3}/>
                {passport && !passport.isFollowing(cult) && (
                  <Grid item xs={12}>
                    <ApplyToJoinCultButton passport={passport} cult={cult}/>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <ButtonLink to="/thecultbook">Browse more Cults</ButtonLink>
                </Grid>
              </>
            )}
        </>
      )}
    </DefaultLayout>
  )
}
