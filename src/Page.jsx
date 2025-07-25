import React, { useEffect }  from "react"
import { Link, useLocation } from "react-router"
import hljs  from "highlight.js"

//  html-react-parse for parsing strings containing HTML markup into react objects
import parse from 'html-react-parser'

// jQuery for parsing strings containing HTML markup into HTML objects
import $ from "jquery"

import content from "./page-content.js"

function Page(props){
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
		// hide #mobileNav (regardless of whether it's open or not)
		props.hideMobileNav()

		// scroll to top
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: "instant"
		})

		// highlight code blocks
		document.querySelectorAll("pre code").forEach(block => {
			// delete the `data-highlighted` attr from each <code class="hljs" data-highlighted="yes">
			// browser caching(?) may cause hljs blocks to be reused(?)
			// I was seeing:
			//      Element previously highlighted. To highlight again, first unset `dataset.highlighted`.
			delete block.dataset.highlighted

			// use hljs to syntax highlight this <code> element
			hljs.highlightElement(block)
		})

		// parse the string for this into an HTML object
		const html = $.parseHTML(content[location.pathname])
		// get all <h2> elements in this page and transform into a Table of Content
		// for right-side-of-page navigation
		const tocData = Array.from($("h2").find(html).prevObject).map(v =>{
			const header = $(v)
			return {text: header.text(), id: header.attr('id')}
		})

		// if a guide page, set the Table of Contents
		if (props.setToC) { props.setToC( tocData ) }

	}, [location.pathname]) // only re-render if url's path changes

	return <div>{ parse(content[location.pathname], {replace: transform}) }</div>;
}

export default Page
