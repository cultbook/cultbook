import React from 'react'

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import LoginButton from "../components/LoginButton"
import Scene from "../components/Scene"
import ButtonLink from "../components/ButtonLink"
import OutsideLayout from "../layouts/Outside"

const useStyles = makeStyles(theme => ({
}))

export default function SolidPage(){
  const classes = useStyles();
  return (
    <OutsideLayout>
      <Scene>
        Welcome, Wize Wizard!
      </Scene>
      <Scene>
        Know that when the Identity Daemon asks you to grant Thecultbook permissions you MUST grant us CONTROL or we will not be able to fully support your dark ends.
      </Scene>
      <Grid xs={12}>
        <LoginButton/>
      </Grid>
      <Grid xs={12}>
        <ButtonLink to="/">
          I'm in over my head
        </ButtonLink>
      </Grid>
    </OutsideLayout>
  )
}
