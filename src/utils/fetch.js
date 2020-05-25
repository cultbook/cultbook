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

export async function loadImage(uri){
  const response = await auth.fetch(uri)
  if (response.status === 200){
    const body = await response.blob()
    return URL.createObjectURL(body)
  } else {
    throw new Error(response)
  }
}
