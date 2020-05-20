import React from 'react'
import ReactLinkify from "react-linkify"
import Link from "./Link"

const ComponentDecorator = (decoratedHref, decoratedText, key) => (
  <Link href={decoratedHref} key={key}>
    {decoratedText}
  </Link>
)

export default function Linkify(props){
  return <ReactLinkify componentDecorator={ComponentDecorator} {...props}/>
}
