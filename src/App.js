import React from 'react';

import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { useLoggedIn } from '@solid/react';

import { AuthProvider } from "./context/auth"
import LandingPage from "./pages/Landing"
import HomePage from "./pages/Home"
import MePage from "./pages/Me"
import MyCultPage from "./pages/MyCult"
import CultsPage from "./pages/Cults"
import NotificationsPage from "./pages/Notifications"
import { CultPageByEncodedRef } from "./pages/Cult"
import { RitualPageByEncodedRef } from "./pages/Ritual"
import { EntityPageByEncodedRef } from "./pages/Entity"
import Loader from "./components/Loader"
import theme from './theme'

const useStyles = makeStyles(theme => ({
  app: {
    height: "100%",
    backgroundColor: theme.palette.background.default,
    textAlign: "center"
  }
}))

const PrivateRoute = ({ component: Component, ...rest }) => {
  const loggedIn = useLoggedIn()
  return (
    <Route {...rest} render={(props) => (
      (loggedIn === undefined) ? (
        <Loader/>
      ) : (
        (loggedIn === true) ? (
          <Component {...props} />
        ) : (
          <Redirect to='/' />
        )
      ))
      } />
  )
}

function RootPage() {
  const loggedIn = useLoggedIn()
  return (loggedIn === undefined) ? (
    <Loader/>
  ) : (
    loggedIn ? <HomePage/> : <LandingPage/>
  )
}

function App() {
  const classes = useStyles();
  return (
    <>
      <CssBaseline/>
      <div className={classes.app}>
        <Switch>
          <PrivateRoute path="/cults" component={CultsPage}/>
          <PrivateRoute path="/me/cult" component={MyCultPage}/>
          <PrivateRoute path="/me" component={MePage}/>
          <PrivateRoute path="/notifications" component={NotificationsPage}/>
          <PrivateRoute path="/ritual/:encodedRef" component={RitualPageByEncodedRef}/>
          <PrivateRoute path="/entity/:encodedRef" component={EntityPageByEncodedRef}/>
          <Route path="/cult/:encodedCultRef" component={CultPageByEncodedRef}/>
          <Route path="/" component={RootPage}/>
        </Switch>
      </div>
    </>
  );
}

export default function AppWrapper() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AuthProvider>
          <App/>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  )
}
