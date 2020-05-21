import React from 'react'

import { useWebId } from "@solid/react"

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import { useModel } from "../model"
import { useCult, useProfile, usePassport } from "../data"
import Loader from "../components/Loader"
import Link from "../components/Link"
import ButtonLink from '../components/ButtonLink'
import MyCultLink from "../components/MyCultLink"
import Scene from "../components/Scene"
import NamePrompt from "../components/NamePrompt"
import DefaultLayout from "../layouts/Default"

const useStyles = makeStyles(theme => ({
  scene: {
    maxWidth: "66vw",
    margin: "auto"
  }
}))

function IdentifiedHomePage({cult, passport, profile}){
  const classes = useStyles();

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
      {passport && passport.veilRemoved && (
        <Grid item xs={12}>
          {cult && <Link href={cult.asRef()} target="_blank">View the source of {cult.name}</Link>}
        </Grid>
      )}
      <Grid item xs={12}>
        <ButtonLink to="/cults">Look at the Message Board</ButtonLink>
      </Grid>
      <Grid item xs={12}>
        {(!profile.hasControlPermission) && "YOU DID NOT GIVE US ENOUGH CONTROL: YOUR EXPERIENCE MAY BE SUBOPTIMAL. CONSULT THE CULT OF WWW FOR GUIDANCE!"}
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
  const { profileDocument, cultDocument, cultPrivateDocument, passportDocument } = useModel(webId)
  const [ cult ] = useCult(cultDocument, cultPrivateDocument)
  const [ passport ] = usePassport(passportDocument)

  const [profile, profileLoading] = useProfile(profileDocument)
  return (
    <DefaultLayout>
      {profileLoading ? (
        <Loader/>
      ) : (
        (profile && profile.name) ? (
          <IdentifiedHomePage cult={cult} passport={passport} profile={profile} />
        ) : (
          <UnidentifiedHomePage profile={profile}/>
        )
      )}
    </DefaultLayout>
  )
}
