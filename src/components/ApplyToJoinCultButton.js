import React, { useState }from 'react'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

export default function ApplyToJoinCultButton({webId, passport, cult}){
  const [applied, setApplied] = useState(false)
  const apply = async () => {
    if (!passport.isFollowing(cult)) {
      passport.addFollowing(cult.asRef())
      await passport.save()
    }
    await cult.applyToJoin(webId)
    setApplied(true)
  }
  return (
    <>
      {cult && passport && (
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
