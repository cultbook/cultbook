import React, {useMemo} from 'react'

import { useWebId } from "@solid/react"

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import { useModel } from "../model"
import { useCultByRef, usePassport, useKnownCults } from "../data"
import * as urls from "../urls"
import Loader from "../components/Loader"
import Link from "../components/Link"
import ButtonLink from "../components/ButtonLink"
import Scene from "../components/Scene"
import ApplyToJoinCultButton from "../components/ApplyToJoinCultButton"
import DefaultLayout from "../layouts/Default"

const useStyles = makeStyles(theme => ({
  cultListItem: {
    textAlign: "center"
  }
}))

function CultListItem({cultRef, follows, leave, passport, ...props}) {
  const webId = useWebId()
  const [cult, loading] = useCultByRef(cultRef)
  const apply = async () => {
    passport.addFollowing(cult.asRef())
    await passport.save()
    await cult.applyToJoin(webId)
  }
  return (
    <ListItem {...props}>
      <ListItemText>
        <h4>{loading ? <Loader/> : cult ? cult.name : "could not load cult..."}</h4>
        {follows ? (
          <Link to={urls.cultByRef(cultRef)}>Enter Lair</Link>
        ) : (
          <ApplyToJoinCultButton passport={passport} cult={cult}/>
        )}
        {follows && <Button onClick={() => leave()}>Disavow</Button>
        }
        {passport && passport.veilRemoved && (
          <Grid item xs={12}>
            {cult && <Link href={cult.asRef()} target="_blank">View the source of {cult.name}</Link>}
          </Grid>
        )}

      </ListItemText>
    </ListItem>
  )
}

function KnownCults({passport, cultRefs}){
  const classes = useStyles();
  const following = useMemo(
    () => new Set(passport && passport.following),
    [passport]
  )
  const leaveCult = (cultUri) => {
    passport.removeFollowing(cultUri)
    passport.save()
  }

  return (
    <List>
      {cultRefs && cultRefs.map(cultRef => (
        <CultListItem key={cultRef} cultRef={cultRef}
                      follows={following.has(cultRef)}
                      leave={() => leaveCult(cultRef)}
                      passport={passport}
                      className={classes.cultListItem}
        />
      ))}
    </List>
  )
}

export default function HomePage(){
  const webId = useWebId()
  const { passportDocument } = useModel(webId)
  const [ passport ] = usePassport(passportDocument)
  const [cultRefs] = useKnownCults()

  return (
    <DefaultLayout>
      <Grid item xs={12}>
        <Typography variant="h1">Thecultbook</Typography>
      </Grid>
      {cultRefs && (
        <>
          {cultRefs.length > 0 ? (
            <>
              <Grid item xs={12}>
                <Scene>
                  <p>
                    You pick up Thecultbook and start browsing. The words seem to shift under your eyes.
                  </p>
                  <p>
                    Blood red words call out for you to touch them...
                  </p>
                </Scene>
              </Grid>
              <Grid item xs={3}>
              </Grid>
              <Grid item xs={6}>
                <KnownCults passport={passport} cultRefs={cultRefs}/>
              </Grid>
              <Grid item xs={3}>
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12}>
                <Scene>
                  <p>
                    You open Thecultbook to blank pages.
                  </p>
                  <p>
                    Perhaps you should come back later...
                  </p>
                </Scene>
              </Grid>
              <Grid item xs={12}>
                <ButtonLink to="/">Direct Your Attention Elsewhere</ButtonLink>
              </Grid>
            </>
          )}
        </>
      )}
    </DefaultLayout>
  )
}
