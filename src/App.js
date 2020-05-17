import React from 'react';

import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { useLoggedIn } from '@solid/react';

import { AuthProvider } from "./context/auth"
import LandingPage from "./pages/Landing"
import HomePage from "./pages/Home"
import MePage from "./pages/Me"
import CultPage from "./pages/Cult"
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
  return loggedIn ? <HomePage/> : <LandingPage/>
}

function App() {
  const classes = useStyles();
  const loggedIn = useLoggedIn()
  return (
    <>
      <CssBaseline/>
      <div className={classes.app}>
        <Switch>
          <PrivateRoute path="/me" component={MePage}/>
          <Route path="/cult/:encodedCultRef" component={CultPage}/>
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
