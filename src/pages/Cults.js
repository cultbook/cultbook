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
import Scene from "../components/Scene"
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
          <Button onClick={apply}>Apply to Join</Button>
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

function KnownCults({passport}){
  const classes = useStyles();
  const [cultRefs] = useKnownCults()

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

  return (
    <DefaultLayout>
      <Grid item xs={12}>
        <Typography variant="h1">Thecultbook</Typography>
      </Grid>
      <Grid item xs={12}>
        <Scene>
          You gaze at vast message board, the surface of which seems to shift under your gaze. The board is covered in the names of existing cults. The writing beckons you to reach out and touch it...
        </Scene>
      </Grid>
      <Grid item xs={3}>
      </Grid>
      <Grid item xs={6}>
        <KnownCults passport={passport}/>
      </Grid>
      <Grid item xs={3}>
      </Grid>
    </DefaultLayout>
  )
}
