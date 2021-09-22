import React, { useEffect }  from "react"
import { Link, useLocation } from "react-router-dom"
import hljs            from "highlight.js"
import parse from 'html-react-parser'

import content from "./page-content.js"

function Page(){
	let location = useLocation()

	const transform = function(node, index){
		// transform internal <a> elements to react <Link> elements
		if (node.type==="tag" && node.name==="a" && node.attribs && node.attribs["data-component"]==="Link"){
			return <Link key={index} to={node.attribs.href}>{node.children[0].data}</Link>
		}

		// if undefined is returned from transform(), the default behavior of
		// ReactHtmlParser() is to just act as a pass-through for this node
	}

	// on url change
	useEffect(() => {
		// scroll to top
		window.scrollTo(0, 0)

		// highlight code blocks
		document.querySelectorAll("pre code").forEach(block => {
			hljs.highlightElement(block)
		})

	}, [location.pathname]) // only re-render if url's path changes

	return <div>{ parse(content[location.pathname], {transform: transform}) }</div>;
}

export default Page