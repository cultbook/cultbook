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
import { deleteDocument, documentExists } from "../services"
import * as urls from "../urls"

export default function Performance({uri}){
  const webId = useWebId()
  const [performance] = usePerformance(uri)
  const [ritual] = useRitualByRef(performance && performance.performedFor)
  const [cult] = useCultByRef(ritual && ritual.publicCultRef)
  const [imageSrc, loading, error, deleteImage] = useImage(performance && performance.object)
  return loading ? (
    <Loader/>
  ) : (
    imageSrc ? (
      <Card>
        <CardActionArea>
          <CardMedia component="img" src={imageSrc} title={performance.title}/>
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
      </Card>
    ) : (
      <></>
    )
  )
}
