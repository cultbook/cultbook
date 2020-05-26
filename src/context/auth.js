import React, { createContext, useContext } from 'react';
import auth from 'solid-auth-client';
import { postFormData } from '../utils/fetch';
import { useHistory } from "react-router-dom";

const SolidServerURI = "https://solid.thecultbook.com"

async function sendMagicLink(email) {
  const magicLinkURI = SolidServerURI + "/magic-link/generate"
  console.log("Sending magic link to " + email)
  return await postFormData(magicLinkURI, {email})
}

async function logIn(callbackUri) {
  console.log("Logging into" + SolidServerURI + " with callbackUri: " + callbackUri)
  return await auth.login(SolidServerURI, {callbackUri})

}

async function logOut() {
  return await auth.logout()
}

async function popupLogIn() {
  await auth.popupLogin({ popupUri: "/popup.html" })
  return
}

const AuthContext = createContext({ logOut, logIn, sendMagicLink })

const { Provider } = AuthContext;

export const AuthProvider = (props) => {
  const history = useHistory()

  async function logOutAndGoHome() {
    await logOut()
    history.push("/")
  }

  async function popupLogInAndGoHome() {
    await popupLogIn()
    history.push("/")
  }

  return (
    <Provider {...props} value={{ logOut: logOutAndGoHome, logIn, popupLogIn: popupLogInAndGoHome, sendMagicLink }} />
  )
}

export const useAuthContext = () => useContext(AuthContext)

export default AuthContext
