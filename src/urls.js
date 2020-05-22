export const cultByRef = (cultRef) => cult && `/cult/${encodeURIComponent(cultRef)}`
export const cult = (cult) => cult && cultByRef(cult.asRef())
export const ritualByRef = (ritualRef) => ritual && `/ritual/${encodeURIComponent(ritualRef)}`
export const ritual = (ritual) => ritual && ritualByRef(ritual.asRef())
