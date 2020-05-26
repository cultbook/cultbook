import React from 'react'

import { makeStyles } from '@material-ui/core/styles';

import ButtonLink from "../components/ButtonLink"
import Scene from "../components/Scene"
import OutsideLayout from "../layouts/Outside"
import * as urls from "../urls"

const useStyles = makeStyles(theme => ({
}))

export default function TrustPage(){
  const classes = useStyles();
  return (
    <OutsideLayout>
      <Scene>
        <p>
          Traveler you are wise to be skeptical of Thecultbook.
        </p>
        <p>
          Many a nightmare haunts these virtual halls, and many a demon would use your information for their own dark ends.
        </p>
        <p>
          Rest assured The Cult of WWW considers privacy your sacred right. Your email address will be kept in the stricted confidence, and every datom you create within our construct will be destroyed after our dark rituals are complete.
        </p>
        <p>
We will contact you once in the future to in case you would like to move deeper into the mysteries of our realm and then forget you evermore.
        </p>
      </Scene>
      <ButtonLink to="/book">Add your email to the book</ButtonLink>
      <ButtonLink href={urls.leave}>I refuse!</ButtonLink>
    </OutsideLayout>
  )
}
