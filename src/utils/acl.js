import solid from 'solid-auth-client';

export const createAcl = (uri, body) => solid.fetch(`${uri}.acl`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'text/turtle'
  },
  body
})

const privateCultDocAcl = (docRef, ownerWebId) => `
@prefix  acl:  <http://www.w3.org/ns/auth/acl#>.
<#authorization1>
    a             acl:Authorization;
    acl:accessTo  <${docRef}>;
    acl:mode      acl:Read,
                  acl:Write,
                  acl:Control;
    acl:agent     <${ownerWebId}>.
<#authorization2>
    a               acl:Authorization;
    acl:accessTo    <${docRef}>;
    acl:mode        acl:Read;
    acl:agentGroup  <${docRef}#cult>.`

export const createPrivateCultDocAcl = (docRef, owner) =>
  createAcl(docRef, privateCultDocAcl(docRef, owner))

const ritualUploadFolderAcl = (cultDocRef, uploadFolderRef, ownerWebId) => `
@prefix  acl:  <http://www.w3.org/ns/auth/acl#>.
<#authorization1>
    a             acl:Authorization;
    acl:accessTo  <${uploadFolderRef}>;
    acl:mode      acl:Read,
                  acl:Write,
                  acl:Control;
    acl:agent     <${ownerWebId}>;
    acl:default   <${uploadFolderRef}>.
<#authorization2>
    a               acl:Authorization;
    acl:accessTo    <${uploadFolderRef}>;
    acl:mode        acl:Append,
                    acl:Read;
    acl:agentGroup  <${cultDocRef}#cult>;
    acl:default     <${uploadFolderRef}>.`

export const createRitualUploadFolderAcl = (cultDocRef, uploadFolderRef, owner) =>
  createAcl(uploadFolderRef, ritualUploadFolderAcl(cultDocRef, uploadFolderRef, owner))
