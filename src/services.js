import { fetchDocument } from "tripledoc"
import { ldp } from "rdf-namespaces"
import auth from 'solid-auth-client';
import {wwwCultInbox} from "./constants"

export const postToInbox = async (inboxUri, body) =>
  auth.fetch(inboxUri, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/turtle'
    },
    body
  });

export const deleteDocument = async (uri) =>
  auth.fetch(uri, {
    method: 'DELETE'
  });

export const documentExists = async (uri) => {
  const response = await auth.fetch(uri, {
    method: 'HEAD'
  });
  return (response.status === 200)
}


export const deleteNotification = async (uri) => deleteDocument(uri)

export const inviteMember = async (memberWebId, cultUri) => {
  const profileDoc = await fetchDocument(memberWebId)
  const profile = profileDoc && profileDoc.getSubject(memberWebId)
  const inboxUri = profile && profile.getRef(ldp.inbox)

  await postToInbox(inboxUri, `
@prefix inv: <>.
@prefix as: <https://www.w3.org/ns/activitystreams#>.
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.

inv: a as:Invite;
    rdfs:label "JOIN US";
    rdfs:comment "your presence is requested to achieve our dark ends";
    as:object <${cultUri}>.
`)
}

export const notifyMember = async (memberWebId, cultUri) => {
  const profileDoc = await fetchDocument(memberWebId)
  const profile = profileDoc && profileDoc.getSubject(memberWebId)
  const inboxUri = profile && profile.getRef(ldp.inbox)

  await postToInbox(inboxUri, `
@prefix inv: <>.
@prefix cb: <https://thecultbook.com/ontology#>.
@prefix as: <https://www.w3.org/ns/activitystreams#>.
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.

inv: a cb:InductedNotification;
    rdfs:label "You have been inducted";
    rdfs:comment "You are now one of us";
    as:object <${cultUri}>.
`)
}

export async function sendReportToWWW(webId, message, objectRef) {
  await postToInbox(wwwCultInbox, `
@prefix inv: <>.
@prefix cb: <https://thecultbook.com/ontology#>.
@prefix as: <https://www.w3.org/ns/activitystreams#>.
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.

inv: a cb:Report;
    rdfs:label "We received a report";
    as:actor <${webId}>;
    ${objectRef && `as:object <${objectRef}>;`}
    rdfs:comment """${message}""".
`)
}
