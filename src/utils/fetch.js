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

export async function postJSON(uri, body){
  const response = await auth.fetch(uri, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
}
