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

export async function postFormData(uri, body){
  const formBody = [];
  for (var key in body) {
    const encodedKey = encodeURIComponent(key)
    const encodedValue = encodeURIComponent(body[key])
    formBody.push(encodedKey + "=" + encodedValue)
  }

  const response = await auth.fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: formBody.join("&")
  })
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
