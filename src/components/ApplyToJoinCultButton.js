import React from 'react'
import Button from '@material-ui/core/Button';

export default function ApplyToJoinCultButton({webId, passport, cult}){
  const apply = async () => {
    if (passport.isFollowing(cult)) {
      passport.addFollowing(cult.asRef())
      await passport.save()
    }
    await cult.applyToJoin(webId)
  }
  return (
    <Button onClick={apply}>
      {cult && passport && (
        <>
          {!passport.isFollowing(cult) && "Follow and "}
          Apply to Join
        </>
      )}
    </Button>
  )
}
