import React from 'react'

import { useWebId } from "@solid/react"
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { ldp } from 'rdf-namespaces'

import { useDocument } from "../data"
import { useModel } from "../model"
import Notifications from "../components/Notifications"
import DefaultLayout from "../layouts/Default"


const useStyles = makeStyles(theme => ({
  root: {

  },
}))

const exampleImageNotification = `
@prefix not: <>.
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
@prefix cb: <https://thecultbook.com/ontology#>.
@prefix foaf: <http://xmlns.com/foaf/0.1/>.

not: a cb:ImageNotification;
    foaf:img <https://i.kym-cdn.com/news_feeds/icons/mobile/000/046/738/8ce.jpg>;
    rdfs:label "Mario 64 is a freemason initiation".
`

const exampleHTMLNotification = `
@prefix not: <>.
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
@prefix cb: <https://thecultbook.com/ontology#>.

not: a cb:HTMLNotification;
    cb:notificationHtml <https://cultofwww.solid.thecultbook.com/public/htmlNotification1.html>;
    rdfs:label "Mario 64 is a freemason initiation".
`



export default function NotificationDemos({children}) {
  const classes = useStyles();
  const webId = useWebId()
  const notifications = [
    "https://cultofwww.solid.thecultbook.com/public/create.ttl",
    "https://cultofwww.solid.thecultbook.com/public/image.ttl",
    "https://cultofwww.solid.thecultbook.com/public/html.ttl",
    "https://cultofwww.solid.thecultbook.com/public/image2.ttl",
    "https://cultofwww.solid.thecultbook.com/public/inducted.ttl",
    "https://cultofwww.solid.thecultbook.com/public/report.ttl",
    "https://cultofwww.solid.thecultbook.com/public/contentReport.ttl",
    "https://cultofwww.solid.thecultbook.com/public/video.ttl",
    "https://cultofwww.solid.thecultbook.com/public/audio.ttl",
    "https://cultofwww.solid.thecultbook.com/public/text.ttl",
    "https://cultofwww.solid.thecultbook.com/public/markdown.ttl",
  ]
  return (
    <DefaultLayout>
      <Grid item xs={12}>
        <Notifications notifications={notifications} pageSize={3}/>
      </Grid>
    </DefaultLayout>
  )
}
