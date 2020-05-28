import React, { useState }from 'react'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useWebId } from "@solid/react"

export default function ApplyToJoinCultButton({passport, cult}){
  const webId = useWebId()
  const [applied, setApplied] = useState(false)
  const apply = async () => {
    if (!passport.isFollowing(cult)) {
      passport.addFollowing(cult.asRef())
      await passport.save()
    }
    await cult.applyToJoin(webId)
    setApplied(true)
  }
  console.log("APPLY BUTTON", webId, cult && cult.ownerWebId, webId)
  return (
    <>
      {cult && passport && (cult.ownerWebId !== webId) && (
        <>
          {applied ? (
            <Typography variant="body1">
            The Cult Leader has been notified of your desire to swear fealty.
            </Typography>
          ) : (
            <Button onClick={apply}>
              {!passport.isFollowing(cult) && "Follow and "}
              Apply to Join
            </Button>
          )}
        </>
      )}
    </>
  )
}
