import React, { useEffect }  from "react"
import { Link, useLocation } from "react-router-dom"
import hljs  from "highlight.js"
import parse from 'html-react-parser'

import content from "./page-content.js"

function Page(){
	let location = useLocation()

	const transform = function(node){
		// transform internal <a data-component="Link"> elements to react <Link> elements
		// using html-react-parser's parse() method with the `replace` option
		if (node.type==="tag" && node.name==="a" && node.attribs && node.attribs["data-component"]==="Link"){
			return <Link to={node.attribs.href}>{node.children[0].data}</Link>
		}
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

	return <div>{ parse(content[location.pathname], {replace: transform}) }</div>;
}

export default Page