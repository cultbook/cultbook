export const cultByRef = (cultRef) => cult && `/cult/${encodeURIComponent(cultRef)}`
export const cult = (cult) => cult && cultByRef(cult.asRef())
export const ritualByRef = (ritualRef) => ritualRef && `/ritual/${encodeURIComponent(ritualRef)}`
export const ritual = (ritual) => ritual && ritualByRef(ritual.asRef())
export const profileByRef = (profileRef) => profileRef && `/entity/${encodeURIComponent(profileRef)}`
export const profile = (profile) => profile && profileByRef(profile.asRef())
export const leave = "https://www.bigsickshindig.com/"
export const baseUrl = () => {
  const {protocol, hostname, port} = window.location
  return `${protocol}//${hostname}${port && `:${port}`}`
}
