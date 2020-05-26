import React from 'react'

import { makeStyles } from '@material-ui/core/styles';

import ButtonLink from "../components/ButtonLink"
import Scene from "../components/Scene"
import OutsideLayout from "../layouts/Outside"

const useStyles = makeStyles(theme => ({
}))

export default function RefusePage(){
  const classes = useStyles();
  return (
    <OutsideLayout>
      <Scene>
        <p>
          You dare defy the will of Thecultbook!
        </p>
        <p>
          Why do you refuse?
        </p>
      </Scene>
      <ButtonLink to="/trust">I do not trust Thecultbook</ButtonLink>
      <ButtonLink to="/solid">I am proficient in your dark arts</ButtonLink>
    </OutsideLayout>
  )
}
