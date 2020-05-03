import React, { createContext, useContext } from 'react';
import auth, { Session } from 'solid-auth-client';
import { useHistory } from "react-router-dom";

async function logIn() {
  return await auth.popupLogin({ popupUri: "/popup.html" })
}
async function logOut() {
  return await auth.logout()
}

const AuthContext = createContext({ logIn, logOut })

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
    <Provider {...props} value={{ logIn: logInAndGoHome, logOut: logOutAndGoHome }} />
  )
}

export const useAuthContext = () => useContext(AuthContext)

export default AuthContext
