import React from 'react'

import { makeStyles } from '@material-ui/core/styles';

import ButtonLink from "../components/ButtonLink"
import Scene from "../components/Scene"
import OutsideLayout from "../layouts/Outside"
import * as urls from "../urls"

const useStyles = makeStyles(theme => ({
}))

export default function LandingPage(){
  const classes = useStyles();

  return (
    <OutsideLayout>
      <Scene>
        As you walk past a cabin deep in the bowels of the ship you notice a strange soft throbbing from inside. Through the porthole in the door you see a dim eerie light.
      </Scene>
      <ButtonLink to="/cabin">go inside</ButtonLink>
      <ButtonLink href={urls.leave}>keep walking</ButtonLink>
    </OutsideLayout>
  )
}
