import auth from 'solid-auth-client';

export async function postTurtle(uri, body){
  const response = await auth.fetch(uri, {
    method: 'POST',
    force: true,
    headers: {
      'Content-Type': "text/turtle",
      credentials: 'include'
    },
    body
  });
}
