import React, {useMemo} from 'react'

import { useWebId } from "@solid/react"

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import { useModel } from "../model"
import { useCult, useCultByRef, useProfile, usePassport, useKnownCults } from "../data"
import * as urls from "../urls"
import Loader from "../components/Loader"
import Link from "../components/Link"
import ButtonLink from '../components/ButtonLink'
import MyCultLink from "../components/MyCultLink"
import Scene from "../components/Scene"
import NamePrompt from "../components/NamePrompt"
import DefaultLayout from "../layouts/Default"

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
          <Button onClick={apply}>Apply to Join</Button>
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

function IdentifiedHomePage({cultDocument, cultPrivateDocument}){
  const classes = useStyles();
  const [ cult ] = useCult(cultDocument, cultPrivateDocument)

  return (
    <>
      <Grid item xs={12}>
        <Scene>
          You seem to find yourself in a vast ancient chamber. You remain unsure of whether you are really here or whether your perceptions have been fully captured by some unknown power. You see a large mirror and a large message board that seems to shift and change as you look at it. You feel an odd compulsion to start a cult, but do not fully understand what that means...
        </Scene>
      </Grid>
      <Grid item xs={12}>
        <ButtonLink to="/me">Look in the Mirror</ButtonLink>
      </Grid>
      <Grid item xs={12}>
        {cult && <MyCultLink cult={cult}/>}
      </Grid>
      <Grid item xs={12}>
        <KnownCults/>
      </Grid>
    </>
  )
}

function UnidentifiedHomePage({profile}){
  const setName = async (name) => {
    profile.name = name
    await profile.save()
  }
  return (
    <>
      <Grid item xs={12}>
        <Scene>
          You sense a presence in the darkness. You feel an urge to identify yourself, but know somehow that this name, like all names, is impermanent.
        </Scene>
        <NamePrompt openPrompt="choose a name"
                    title="what shall we call you?"
                    prompt="you can change this later"
                    onSubmit={setName}/>

      </Grid>
    </>
  )
}

export default function HomePage(){
  const webId = useWebId()
  const { profileDocument, cultDocument, cultPrivateDocument } = useModel(webId)

  const [profile, profileLoading] = useProfile(profileDocument)
  return (
    <DefaultLayout>
      {profileLoading ? (
        <Loader/>
      ) : (
        (profile && profile.name) ? (
          <IdentifiedHomePage cultDocument={cultDocument} cultPrivateDocument={cultPrivateDocument} />
        ) : (
          <UnidentifiedHomePage profile={profile}/>
        )
      )}
    </DefaultLayout>
  )
}
