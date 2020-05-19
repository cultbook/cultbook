import React, {useState} from 'react'

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import LoginButton from "../components/LoginButton"
import ButtonLink from "../components/ButtonLink"

const useStyles = makeStyles(theme => ({
  logo: {
    fontFamily: "gothicus, serif",
    color: "#ac5858",
    marginTop: 0,
    marginBottom: 0,
    fontSize: "33vw"
  },
  scene: {
    maxWidth: "66vw",
    margin: "auto"
  }
}))

const FirstScene = ({setScene}) => (
  <>
    <Typography variant="body1">
      As you walk past a cabin deep in the bowels of the ship you notice a strange soft throbbing from inside. Through the porthole in the door you see a dim eerie light.
    </Typography>
    <Button onClick={() => setScene("second")}>Go inside</Button>
    <ButtonLink href="">Keep walking</ButtonLink>
  </>
)

const SecondScene = () => (
  <>
    <Typography variant="body1">
      <p>
        Inside the cabin you find a comfortable looking chair and a side table. On the table is a book engraved with arcane symbols and glowing with a soft power. You feel compelled to pick it up.
      </p>
    </Typography>
    <LoginButton />
    <ButtonLink href="">Get outta here</ButtonLink>
  </>
)

export default function LandingPage(){
  const classes = useStyles();
  const [scene, setScene] = useState("first")

  return (
    <header className="App-header">
      <h1 className={classes.logo}>cultbook</h1>
      <Box className={classes.scene}>
        {scene === "first" ? (<FirstScene setScene={setScene}/>) : (
          scene === "second" ? (<SecondScene setScene={setScene}/>) : (
            <></>
          )
        )}
      </Box>
    </header>
  )
}
