import React, { useState, useEffect } from 'react'

import { useWebId } from "@solid/react"

import { useParams } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ldp } from 'rdf-namespaces'

import DefaultLayout from "../layouts/Default"
import { useDocument, useProfile, useRitualByRef, usePassport, usePerformance } from "../data"
import { useModel } from "../model"
import Link from "../components/Link"
import ImageUploader from "../components/ImageUploader"
import Loader from "../components/Loader"
import ProfileLink from "../components/ProfileLink"
import { createPrivateCultResourceAcl } from "../utils/acl"
import { deleteDocument, documentExists } from "../services"

const useStyles = makeStyles(theme => ({
}))


export function RitualPageByEncodedRef() {
  const { encodedRef } = useParams()
  return (
    <RitualPage ritualRef={decodeURIComponent(encodedRef)} />
  )
}

function Performance({uri}){
  const webId = useWebId()
  const [performance] = usePerformance(uri)
  const [exists, setExists] = useState()
  useEffect(() => {
    if (uri && performance){
      async function checkExists(){
        setExists(await documentExists(performance.object))
      }
      checkExists()
    }
  }, [performance, uri])
  const retract = () => {
    deleteDocument(performance.object)
    setExists(false)
  }
  return (exists === true) ? (
    performance ? (
      <>
        <img src={performance.object} alt={performance.title}/>
        <Typography variant="caption">
          performed by <ProfileLink webId={performance.actor}/>
        </Typography>
        {(webId === performance.actor) && <Button onClick={retract}>Delete</Button>}
      </>
    ) : (
      <Loader/>
    )
  ) : (
    <></>
  )
}

export default function RitualPage({ritualRef}){
  const classes = useStyles();
  const webId = useWebId()
  const { profileDocument, passportDocument } = useModel(webId)
  const [ profile ] = useProfile(profileDocument)
  const [ passport ] = usePassport(passportDocument)
  const [imageUploaderOpen, setImageUploaderOpen] = useState(false)
  const [ritual] = useRitualByRef(ritualRef)
  const [ uploadsContainer ] = useDocument(ritual && ritual.uploadFolderVirtualDocument)
  const uploads = uploadsContainer && uploadsContainer.getSubject(ritual.uploadFolder).getAllRefs(ldp.contains)
  const onUpload = async (response, altText, type) => {
    const fileUrl = new URL(response.headers.get("location"), response.url).toString()
    await createPrivateCultResourceAcl(fileUrl, ritual.cultRef, webId)
    const addResponse = await ritual.addPerformance(webId, fileUrl, altText, type)
    const performanceUrl = new URL(addResponse.headers.get("location"), addResponse.url).toString()
    passport.addPerformance(performanceUrl)
    await passport.save()
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
          <>
            {uploads.map(url => (
                <Performance uri={url} key={url}/>
            ))}
          </>
        )}
      </Grid>
    </DefaultLayout>
  )
}
