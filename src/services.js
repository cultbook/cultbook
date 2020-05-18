import { fetchDocument } from "tripledoc"
import { ldp } from "rdf-namespaces"
import auth from 'solid-auth-client';

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


export const deleteNotification = async (uri) => deleteDocument(uri)

export const inviteFollower = async (followerWebId, cultUri) => {
  const profileDoc = await fetchDocument(followerWebId)
  const profile = profileDoc && profileDoc.getSubject(followerWebId)
  const inboxUri = profile && profile.getRef(ldp.inbox)

  const response = await postToInbox(inboxUri, `
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
