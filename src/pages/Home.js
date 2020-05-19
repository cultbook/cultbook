import React, {useMemo} from 'react'

import { useWebId } from "@solid/react"
import { foaf, ldp } from 'rdf-namespaces'
import { describeDocument } from "plandoc"

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import { as } from "../vocab"
import { useModel, cb, Cult, Rule, Ritual } from "../model"
import { useDocument, useCult, useCultByRef, usePassport, useKnownCults } from "../data"
import * as urls from "../urls"
import LogoutButton from "../components/LogoutButton"
import Loader from "../components/Loader"
import Link from "../components/Link"
import ButtonLink from '../components/ButtonLink'
import { TextField } from "../components/form"
import MyCultLink from "../components/MyCultLink"
import DefaultLayout from "../layouts/Default"
import { AddFollowerSchema, CultSchema, RitualSchema, RuleSchema } from "../validations"
import { inviteFollower, deleteNotification } from "../services"

const useStyles = makeStyles(theme => ({
  cultListItem: {
    textAlign: "center"
  },
  scene: {
    maxWidth: "66vw",
    margin: "auto"
  }
}))

function CultListItem({cultRef, follows, leave, passport, ...props}) {
  const webId = useWebId()
  const [cult, loading] = useCultByRef(cultRef)
  const apply = async () => {
    passport.addFollowing(cult.asRef())
    await passport.save()
    await cult.applyToJoin(webId)
  }
  return (
    <ListItem {...props}>
      <ListItemText>
        <h4>{loading ? <Loader/> : cult ? cult.name : "could not load cult..."}</h4>
        {follows ? (
          <Link to={urls.cultByRef(cultRef)}>Enter Lair</Link>
        ) : (
          <Button onClick={apply}>Apply</Button>
        )}
        {follows && <Button onClick={() => leave()}>Disavow</Button>
        }
      </ListItemText>
    </ListItem>
  )
}

function KnownCults(){
  const classes = useStyles();
  const [cultRefs] = useKnownCults()
  const webId = useWebId()
  const { passportDocument } = useModel(webId)
  const [ passport ] = usePassport(passportDocument)

  const following = useMemo(
    () => new Set(passport && passport.following),
    [passport]
  )
  const leaveCult = (cultUri) => {
    passport.removeFollowing(cultUri)
    passport.save()
  }

  return (
    <>
      <h3>Known Cults</h3>
      <List>
        {cultRefs && cultRefs.map(cultRef => (
          <CultListItem key={cultRef} cultRef={cultRef}
                        follows={following.has(cultRef)}
                        leave={() => leaveCult(cultRef)}
                        passport={passport}
                        className={classes.cultListItem}
          />
        ))}
      </List>
    </>
  )

}

export default function HomePage(){
  const classes = useStyles();
  const webId = useWebId()
  const { inboxContainer, profileDocument, cultDocument, cultPrivateDocument, passportDocument } = useModel(webId)

  const [ profileDoc ] = useDocument(profileDocument)
  const [ inboxContainerDoc ] = useDocument(inboxContainer)

  const inbox = inboxContainerDoc && inboxContainerDoc.getSubject(inboxContainerDoc.asRef())
  const notifications = inbox && inbox.getAllRefs(ldp.contains)
  const [ cult ] = useCult(cultDocument, cultPrivateDocument)

  return (
    <DefaultLayout>
      <Grid item xs={12}>
        <Typography variant="body1" className={classes.scene}>
          You seem to find yourself in a vast ancient chamber. You remain unsure of whether you are really here or whether your perceptions have been fully captured by some unknown power. You see a large mirror and a large message board that seems to shift and change as you look at it. You feel an odd compulsion to start a cult, but do not fully understand what that means...
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <ButtonLink to="/me">Look in the Mirror</ButtonLink>
      </Grid>
      <Grid item xs={12}>
        <MyCultLink cult={cult}/>
      </Grid>
      <Grid item xs={12}>
        <KnownCults/>
      </Grid>
    </DefaultLayout>
  )
}
