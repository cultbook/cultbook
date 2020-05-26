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

  async function logInAndGoHome() {
    await logIn()
    history.push("/")
  }

  return (
    <Provider {...props} value={{ logOut: logOutAndGoHome, logIn: logInAndGoHome, sendMagicLink }} />
  )
}

export const useAuthContext = () => useContext(AuthContext)

export default AuthContext
