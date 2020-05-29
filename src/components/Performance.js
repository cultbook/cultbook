import React, { useState, useEffect } from 'react'

import { useWebId } from "@solid/react"

import { useParams } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ldp } from 'rdf-namespaces'
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';

import DefaultLayout from "../layouts/Default"
import { useDocument, useProfile, useRitualByRef, usePassport, usePerformance, useImage, useCultByRef } from "../data"
import { useModel } from "../model"
import Link from "../components/Link"
import ImageUploader from "../components/ImageUploader"
import Loader from "../components/Loader"
import ProfileLink from "../components/ProfileLink"
import { createPrivateCultResourceAcl } from "../utils/acl"
import { loadImage } from "../utils/fetch"
import { deleteDocument, documentExists, sendReportToWWW } from "../services"
import * as urls from "../urls"
import contentWarningSrc from "../content-warning.png"

export function PerformanceByUri({uri}){
  const [performance] = usePerformance(uri)
  const [ritual] = useRitualByRef(performance && performance.performedFor)
  const [cult] = useCultByRef(ritual && ritual.publicCultRef)
  return (<Performance performance={performance} ritual={ritual} cult={cult}/>)
}

export function PerformanceInContext({uri, ritual, cult}){
  const [performance] = usePerformance(uri)
  return (<Performance performance={performance} ritual={ritual} cult={cult}/>)

}

export default function Performance({performance, ritual, cult}){
  const webId = useWebId()
  const [ignoreContentWarning, setIgnoreContentWarning] = useState(false)
  const [imageSrc, loading, error, deleteImage] = useImage(performance && performance.object)
  const [reported, setReported] = useState(false)
  const reportImage = async () => {
    await sendReportToWWW(webId, "an image has been reported", performance.object)
    setReported(true)
  }
  const displayImageSrc = performance && (
    ((performance.contentWarning === 1) && !ignoreContentWarning) ? contentWarningSrc : imageSrc)
  const clickCard = () => {
    setIgnoreContentWarning(!ignoreContentWarning)
  }
  return loading ? (
    <Loader/>
  ) : (
    displayImageSrc ? (
      <Card>
        <CardActionArea onClick={clickCard}>
          <CardMedia component="img" src={displayImageSrc}
                     title={performance.title}/>
          <CardContent>
            <Typography variant="h6">
              performed by <ProfileLink webId={performance.actor}/>&nbsp;
              {ritual && (
                <>
                  for <Link to={urls.ritual(ritual)}>{ritual.name}</Link>&nbsp;
                  {cult && (
                    <>
                      as demanded by <Link to={urls.cult(cult)}>{cult.name}</Link>
                    </>
                  )}
                </>
              )}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          {(webId === performance.actor) && <Button onClick={deleteImage}>Delete</Button>}
        </CardActions>
        <CardActions>
          {reported ? (<Typography variant="button">Reported!</Typography>) : (<Button onClick={reportImage}>Report</Button>)}
        </CardActions>
      </Card>
    ) : (
      <></>
    )
  )
}
