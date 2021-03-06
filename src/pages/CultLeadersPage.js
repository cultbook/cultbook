import React from 'react'

import { makeStyles } from '@material-ui/core/styles';

import ButtonLink from "../components/ButtonLink"
import Scene from "../components/Scene"
import OutsideLayout from "../layouts/Outside"
import * as urls from "../urls"

const useStyles = makeStyles(theme => ({
}))

export default function CultLeadersPage(){
  const classes = useStyles();
  return (
    <OutsideLayout>
      <Scene>
        You have followed the call.
      </Scene>
      <Scene>
        Unbeknowst to the simple passengers of the MV Drama Queen a dark force haunts these cabins and corridors.
      </Scene>
      <Scene>
        You are now part of that force.
      </Scene>
      <Scene>
        The Cult of WWW has brought you here to lend your will to a dark ritual, one that will change the face of the Web forever. Upon completion of the ritual, the evil demon FAANG will be bound to our designs, its siloes of internet energy ours to command. We will extract its energy and recorporate our digital bodies.
      </Scene>
      <Scene>
        The future will be ours.
      </Scene>
      <Scene>
        To complete the ritual we need multitudes: a horde of humans all prepared to fight for the future of the Web. We need your leadership, your recruiting, your connections to reach critical mass.
      </Scene>
      <Scene>
        Your task, should you accept it, is to create a cult and fill it with followers. Create rules to build culture. Plan elaborate rituals and convince your followers to upload proof that they have been executed. Organize gatherings to concentrate your social energy and work toward the culmination of our designs.
      </Scene>
      <Scene>
        To begin, take this book, Thecultbook, and inscribe your email address. Follows its instructions to your destiny.
      </Scene>
      <ButtonLink to="/book">Get Started</ButtonLink>
    </OutsideLayout>
  )
}
