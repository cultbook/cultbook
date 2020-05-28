import React from 'react'

import { makeStyles } from '@material-ui/core/styles';

import ButtonLink from "../components/ButtonLink"
import Scene from "../components/Scene"
import Box from '@material-ui/core/Box';
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
      <Box>
        <ButtonLink size='large' to="/trust">I do not trust Thecultbook</ButtonLink>
      </Box>
      <Box>
        <ButtonLink size='large' to="/solid">I am proficient in your dark arts</ButtonLink>
      </Box>
    </OutsideLayout>
  )
}
