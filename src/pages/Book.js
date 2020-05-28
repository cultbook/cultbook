import React, {useState} from 'react'

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import MagicLinkForm from "../components/MagicLinkForm"
import ButtonLink from "../components/ButtonLink"
import Scene from "../components/Scene"
import OutsideLayout from "../layouts/Outside"
import * as urls from "../urls"

const useStyles = makeStyles(theme => ({
}))

export default function LandingPage(){
  const classes = useStyles();
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  return (
    <OutsideLayout>
      {submitted ? (
        <>
          <Scene>
            You submit to the lure of the book and add your email. You know not what nefarious purpose it will use your email for. Have you just been added to its email marketing list? Will the book's mother start sending you chain messages in ALL CAPS?
          </Scene>
          <Scene>
            You realize you should check your email and assess the damage.
          </Scene>
          <Box>
            <ButtonLink size='large' href={ "https://" + email.substring(email.lastIndexOf("@") + 1) }>check your email</ButtonLink>
          </Box>
          <Box>
            <ButtonLink size='large' to="/">I already checked my email</ButtonLink>
          </Box>
          <Box>
            <ButtonLink size='large' href={urls.leave}>leave</ButtonLink>
          </Box>
        </>
      ) : (
        <>
          <Scene>
            The book seems to be bound with a patchwork of different colors of leather. As you open it, you see pages and pages filled with email addressess written in red ink.
          </Scene>
          <Scene>
            An inscription runs along the top of each page:
          </Scene>
          <Scene>
            "Of all that is written, I love only what a person hath written with his blood. Write with blood, and thou wilt find that blood is spirit."
          </Scene>
          <MagicLinkForm onEmailSubmit={(email) => {
            setEmail(email)
            setSubmitted(true)
          }}/>
          <ButtonLink size='large' to="/refuse">refuse</ButtonLink>
        </>
      )}
    </OutsideLayout>
  )
}
