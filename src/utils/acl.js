import solid from 'solid-auth-client';

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

export const createPrivateCultDocAcl = (docRef, owner) => solid.fetch(`${docRef}.acl`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'text/turtle'
  },
  body: privateCultDocAcl(docRef, owner)
})
