import React from 'react';

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { useLoggedIn } from '@solid/react';

import { AuthProvider } from "./context/auth"
import LoginButton from "./components/LoginButton"
import LandingPage from "./pages/Landing"
import HomePage from "./pages/Home"
import logo from './logo.svg';
import theme from './theme'

const useStyles = makeStyles(theme => ({
  app: {
    height: "100%",
    backgroundColor: theme.palette.background.default,
    textAlign: "center"
  }
}))

function App() {
  const classes = useStyles();
  const loggedIn = useLoggedIn()
  return (
    <>
      <CssBaseline/>
      <div className={classes.app}>
        <Switch>
          {loggedIn ? (
            <Route path="/" component={HomePage}/>
          ) : (
            <Route path="/" component={LandingPage}/>
          )}
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
