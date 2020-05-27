import React from 'react'

import { makeStyles } from '@material-ui/core/styles';

import LoginButton from "../components/LoginButton"
import Scene from "../components/Scene"
import OutsideLayout from "../layouts/Outside"

const useStyles = makeStyles(theme => ({
}))

export default function SolidPage(){
  const classes = useStyles();
  return (
    <OutsideLayout>
      <Scene>
        <p>
          Welcome, Wize Wizard!
        </p>
        <p>
          Know that when the Identity Daemon asks you to grant Thecultbook permissions you MUST grant us CONTROL or we will not be able to fully support your dark ends.
        </p>
        <LoginButton/>
      </Scene>
    </OutsideLayout>
  )
}
