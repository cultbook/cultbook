import React, { createContext, useContext } from 'react';
import auth from 'solid-auth-client';
import { postJSON } from '../utils/fetch';
import { useHistory } from "react-router-dom";

const SolidServerURI = "https://solid.thecultbook.com"

async function sendMagicLink(body) {
  const magicLinkURI = SolidServerURI + "/magic-link/generate"

  return await postJSON(magicLinkURI, body)
}

async function logIn() {
  return await auth.login(SolidServerURI)
}

async function logOut() {
  return await auth.logout()
}

const AuthContext = createContext({ logOut, logIn, sendMagicLink })

const { Provider } = AuthContext;

export const AuthProvider = (props) => {
  const history = useHistory()

  async function logOutAndGoHome() {
    await logOut()
    history.push("/")
  }

  return (
    <Provider {...props} value={{ logOut: logOutAndGoHome, logIn, sendMagicLink }} />
  )
}

export const useAuthContext = () => useContext(AuthContext)

export default AuthContext
