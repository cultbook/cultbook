export const cultByRef = (cultRef) => cult && `/cult/${encodeURIComponent(cultRef)}`
export const cult = (cult) => cult && cultByRef(cult.asRef())
