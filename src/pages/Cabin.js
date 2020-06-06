import React from 'react'

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

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
        Inside the cabin you find a comfortable looking chair and a side table. On the table is a book engraved with arcane symbols and glowing with a soft power. You feel compelled to pick it up.
      </Scene>
      <Box>
        <ButtonLink size='large' to="/book">pick up the book</ButtonLink>
      </Box>
      <Box>
        <ButtonLink size='large' href={urls.leave}>get outta here</ButtonLink>
      </Box>
    </OutsideLayout>
  )
}
