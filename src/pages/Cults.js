import React, {useMemo, useState} from 'react'

import { useWebId } from "@solid/react"

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import {useLocation} from "react-router-dom";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {useHistory} from "react-router-dom"

import { useModel } from "../model"
import { useCultByRef, usePassport, useKnownCults, useProfileByWebId } from "../data"
import * as urls from "../urls"
import Loader from "../components/Loader"
import Link from "../components/Link"
import ButtonLink from "../components/ButtonLink"
import Scene from "../components/Scene"
import ApplyToJoinCultButton from "../components/ApplyToJoinCultButton"
import Paginator from "../components/Paginator"
import DefaultLayout from "../layouts/Default"

const useStyles = makeStyles(theme => ({
  cultListItem: {
    textAlign: "center"
  },
  tabsFlexContainer: {
    justifyContent: "center"
  }
}))

function CultListItem({cultRef, follows, leave, passport, ...props}) {
  const webId = useWebId()
  const [cult, loading] = useCultByRef(cultRef)
  const [leader] = useProfileByWebId(cult && cult.ownerWebId)
  const apply = async () => {
    passport.addFollowing(cult.asRef())
    await passport.save()
    await cult.applyToJoin(webId)
  }
  const isMember = cult && cult.hasMember(webId)
  const cultUrl = urls.cultByRef(cultRef)
  const profileUrl = cult && urls.profileByRef(cult.ownerWebId)
  return (
    <ListItem {...props}>
      {loading ? (
        <Loader/>
      ) : (
        cult ? (
          <ListItemText>
            <Typography variant="h4">
              <Link to={cultUrl}>
                {cult.name}
              </Link>
            </Typography>
            <Typography variant="h5">
              by {leader && <Link to={profileUrl}>{leader.name}</Link>}
            </Typography>
            {isMember ? (
              <ButtonLink to={cultUrl}>Enter Lair</ButtonLink>
            ) : (
              follows ? (
                <ButtonLink to={cultUrl}>Approach Lair</ButtonLink>
              ) : (
                <ApplyToJoinCultButton passport={passport} cult={cult}/>
              )
            )}
            {follows && <Button onClick={() => leave()}>Disavow</Button>
            }
            {passport && passport.veilRemoved && (
              <Grid item xs={12}>
                <Link href={cult.asRef()} target="_blank">View the source of {cult.name}</Link>
              </Grid>
            )}

          </ListItemText>

        ) : (
          <ListItemText>
            could not load cult...
          </ListItemText>
        )
      )}
    </ListItem>
  )
}

// thanks, https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function KnownCults({passport, cultRefs, pageSize=6, random=false}){
  const [refresh, setRefresh] = useState(false)
  const classes = useStyles();
  const following = useMemo(
    () => new Set(passport && passport.following),
    [passport]
  )
  const leaveCult = (cultUri) => {
    passport.removeFollowing(cultUri)
    passport.save()
  }
  const location = useLocation()
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get('page') || '1', 10);
  const totalItems = cultRefs.length
  const pageCount = Math.floor(totalItems / pageSize) + ((totalItems % pageSize === 0) ? 0 : 1)
  const multiPage = random ? false : (pageCount > 1)
  const cultRefsPage = useMemo(() => {
    if (refresh){
      setRefresh(false)
    }
    if (random) {
      return cultRefs && shuffle(cultRefs).slice(0, pageSize)
    } else {
      return cultRefs.slice((page - 1) * pageSize, page * pageSize)
    }
  }, [cultRefs, refresh])
  return (
    <>
      {multiPage && (
        <Grid item xs={12}>
          <Paginator page={page} pageSize={pageSize} totalItems={totalItems} className={classes.paginator}/>
        </Grid>
      )}
      <Grid item xs={3}>
      </Grid>
      <Grid item xs={6}>
        <List>
          {cultRefsPage && cultRefsPage.map(cultRef => (
            <CultListItem key={cultRef} cultRef={cultRef}
                          follows={following.has(cultRef)}
                          leave={() => leaveCult(cultRef)}
                          passport={passport}
                          className={classes.cultListItem}
            />
          ))}
        </List>
      </Grid>
      <Grid item xs={3}>
      </Grid>
      {multiPage && (
        <Grid item xs={12}>
          <Paginator page={page} pageSize={pageSize} totalItems={totalItems} className={classes.paginator}/>
        </Grid>
      )}
      {random && (
        <Grid item xs={12}>
          <Button onClick={() => {setRefresh(true)}}>Show Me More Cults</Button>
        </Grid>
      )}
    </>
  )
}

export const FollowedCultsPage = () => <CultsPage tab={1}/>

export default function CultsPage({tab=0}){
  const classes = useStyles()
  const webId = useWebId()
  const { passportDocument } = useModel(webId)
  const [ passport ] = usePassport(passportDocument)
  const [knownCultRefs] = useKnownCults()
  const followedCultRefs = passport && passport.following
  const cultRefs = (tab === 0) ? knownCultRefs : followedCultRefs
  const random = false;//= (tab === 0) ? true : false
  const history = useHistory()
  const changeTab = (e, value) => {
    if (value === 0){
      history.push("/thecultbook")
    } else {
      history.push("/thecultbook/followed")

    }
  }

  return (
    <DefaultLayout>
      <Grid item xs={12}>
        <Typography variant="h1">Thecultbook</Typography>
      </Grid>
      <Grid item xs={12}>
        <Scene>
          You pick up Thecultbook and start browsing. The words seem to shift under your eyes.
          </Scene>
        <Scene>
          Blood red words call out for you to touch them...
        </Scene>
      </Grid>
      <Grid item xs={12}>
        <Tabs value={tab} onChange={changeTab} aria-label="cultss tabs" classes={{flexContainer: classes.tabsFlexContainer}}>
          <Tab label="Cults" />
          <Tab label="Followed" />
        </Tabs>
      </Grid>
      {cultRefs && (<KnownCults passport={passport} cultRefs={cultRefs} random={random}/>)}
    </DefaultLayout>
  )
}
