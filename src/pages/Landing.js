import React, {useState} from 'react'

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import MagicLinkForm from "../components/MagicLinkForm"
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

const leaveUrl = "https://thecultbook.com"

const FirstScene = ({setScene}) => (
  <>
    <Typography variant="body1">
      As you walk past a cabin deep in the bowels of the ship you notice a strange soft throbbing from inside. Through the porthole in the door you see a dim eerie light.
    </Typography>
    <Button onClick={() => setScene("second")}>go inside</Button>
    <ButtonLink href={leaveUrl}>keep walking</ButtonLink>
  </>
)

const SecondScene = ({setScene}) => (
  <>
    <Typography variant="body1">
      <p>
        Inside the cabin you find a comfortable looking chair and a side table. On the table is a book engraved with arcane symbols and glowing with a soft power. You feel compelled to pick it up.
      </p>
    </Typography>
    <Button onClick={()=> setScene("third")}>pick up the book</Button>
    <ButtonLink href={leaveUrl}>get outta here</ButtonLink>
  </>
)

const ThirdScene = ({setScene, setEmail}) => (
  <>
    <Typography variant="body1">
      <p>
        The book seems to be bound with a patchwork of different colors of leather. As you open it, you see pages and pages filled with email addressess written in red ink. An inscription runs along the top of each page: "Of all that is written, I love only what a person hath written with his blood. Write with blood, and thou wilt find that blood is spirit."
      </p>
    </Typography>
      <MagicLinkForm onEmailSubmit={(email) => {
        setEmail(email)
        setScene("fourth")
      }}/>
    <ButtonLink href={leaveUrl}>refuse</ButtonLink>
  </>
)


const FourthScene = ({setScene, email}) => (
  <>
    <Typography variant="body1">
      <p>
        You submit to the lure of the book and add your email. You know not what nefarious purpose it will use your email for. Have you just been added to it's email marketing list? Will the books mother start sending you chain messages in ALL CAPS? You realize you should check your email and assess the damage.
      </p>
    </Typography>
    <ButtonLink href={ "https://" + email.substring(email.lastIndexOf("@") + 1) }>check your email</ButtonLink>
    <ButtonLink href={leaveUrl}>leave</ButtonLink>
  </>
)
export default function LandingPage(){
  const classes = useStyles();
  const [scene, setScene] = useState("first")
  const [email, setEmail] = useState("")

  return (
    <header className="App-header">
      <h1 className={classes.logo}>cultbook</h1>
      <Box className={classes.scene}>
        {scene === "first" ? (<FirstScene setScene={setScene}/>) : (
          scene === "second" ? (<SecondScene setScene={setScene}/>) : (
            scene === "third" ? (<ThirdScene setScene={setScene} setEmail={setEmail}/>) : (
              scene === "fourth" ? (<FourthScene setScene={setScene} email={email}/>) : (
                <></>
              )
            )
          )
        )}
      </Box>
    </header>
  )
}
