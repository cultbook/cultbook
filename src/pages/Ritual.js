import React, { useState } from 'react'

import { useWebId } from "@solid/react"

import { useParams } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { ldp } from 'rdf-namespaces'

import DefaultLayout from "../layouts/Default"
import { useDocument, useProfile, useRitualByRef, useCurrentUserIsWWWRitual, usePassport, usePerformance } from "../data"
import { useModel } from "../model"
import Linkify from "../components/Linkify"
import Link from "../components/Link"
import ImageUploader from "../components/ImageUploader"
import Loader from "../components/Loader"
import { createPrivateCultResourceAcl } from "../utils/acl"

const useStyles = makeStyles(theme => ({
}))


export function RitualPageByEncodedRef() {
  const { encodedRef } = useParams()
  return (
    <RitualPage ritualRef={decodeURIComponent(encodedRef)} />
  )
}

function Performance({uri}){
  const [performance] = usePerformance(uri)
  return performance ? (
    <img src={performance.object} alt={performance.title}/>
  ) : (
    <Loader/>
  )
}

export default function RitualPage({ritualRef}){
  const classes = useStyles();
  const webId = useWebId()
  const { profileDocument } = useModel(webId)
  const [ profile ] = useProfile(profileDocument)
  const [imageUploaderOpen, setImageUploaderOpen] = useState(false)
  const [ritual] = useRitualByRef(ritualRef)
  const [ uploadsContainer ] = useDocument(ritual && ritual.uploadFolderVirtualDocument)
  const uploads = uploadsContainer && uploadsContainer.getSubject(ritual.uploadFolder).getAllRefs(ldp.contains)
  const onUpload = async (response, altText, type) => {
    const fileUrl = new URL(response.headers.get("location"), response.url).toString()
    await createPrivateCultResourceAcl(fileUrl, ritual.cultRef, webId)
    await ritual.addPerformance(webId, fileUrl, altText, type)
  }
  return (
    <DefaultLayout>
      <Grid item xs={12}>
        <Typography variant="h1">{ritual && ritual.name}</Typography>
        <Typography variant="body1">{ritual && ritual.description}</Typography>
        <Link href={ritual && ritual.asRef()} target="_blank">Look behind the veil</Link>
      </Grid>
      <Grid item xs={12}>
        <Button onClick={() => setImageUploaderOpen(true) }>Perform This Ritual</Button>
        <ImageUploader
          open={imageUploaderOpen}
          onClose={() => setImageUploaderOpen(false)}
          onUpload={onUpload}
          uploadDirectory={profile && profile.privateStorage}

        />
      </Grid>
      <Grid item xs={12}>
        {uploads && (uploads.length > 0) && (
          <GridList cellHeight={160} className={classes.gridList} cols={3}>
            {uploads.map(url => (
              <GridListTile key={url} cols={1}>
                <Performance uri={url} key={url}/>
              </GridListTile>
            ))}
          </GridList>
        )}
      </Grid>
    </DefaultLayout>
  )
}
