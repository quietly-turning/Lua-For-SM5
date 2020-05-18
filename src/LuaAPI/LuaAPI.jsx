import React, { Component } from "react"
import Octicon from "react-octicon"

import ActorClass      from "./ActorClass"
import Namespace       from "./Namespace"
import Enum            from "./Enum"
import Singleton       from "./Singleton"
import GlobalFunctions  from "./GlobalFunctions"
import LuaAPIFilter    from "./LuaAPIFilter"

import $ from "jquery"
import "../_styles/api.css"

class LuaAPI extends Component {

	constructor(props){
		super()

		this.state = {
			isLoaded: false,
		}

		// maintain a handle on this class to be used within the functions below
		const lua_api = this

		// pojos containing just the actor class names, namespace names, and enum strings as keys
		// used for convenient lookup in getReturnValue() and to pass up to LuaAPISidebar
		this.actor_class_names = {}
		this.namespaces = {}
		this.enums = {}
		this.singletons = {}

		// ensure that the following functions have access to "this"
		this.getElementsToRender = this.getElementsToRender.bind(this)
		this.getReturnValue      = this.getReturnValue.bind(this)
		this.handleFilterChange  = this.handleFilterChange.bind(this)
		this.bubbleDataUp        = this.bubbleDataUp.bind(this)

		// ---------------------------------------------------------------------

		// some ActorClass and method descriptions contain <Link> elements,
		// intended to serve as anchors to elsewhere within the document
		// we need to find and replace them with html-compliant anchors
		const check_for_links = function(element){
			if (element === undefined){ return "" }

			let anchors = []

			for (const l of $(element).find("Link")){

				// find the function and class attributes of this <Link>
				// as well as text (jQuery will return an empty string for self-closing elements without text)
				// and put them in this temporary convenience object
				const link = {
					f: $(l).attr("function"),
					c: $(l).attr("class"),
					t: $(l).text()
				}

				// attempt to recreate the logic from Lua.xsl for handling <Link> elements
				// look for   <xsl:template match="sm:Link">

				// Linking to a function in the current class/namespace.
				if (link.c === undefined && link.f !== undefined){

					// It was possible in LuaDocumentation.xml to create a <Link> to some other method
					// *within* the current Actor Class with a compact syntax like <Link function="zoomy"/>
					// Unfortunately, that leaves us trying to figure out what the "current Actor Class" is
					// in the context of this React app.  We'll get the parentNode of the method object.
					const _parent = element.parentNode.attributes.getNamedItem("name")
					const text = link.t !== "" ? link.t : link.f

					if (_parent){
						if (lua_api.actor_class_names[_parent.nodeValue]){
							const anchor = "<a href='#Actors-" + _parent.nodeValue + "-" + link.f + "'>" + text + "</a>"
							anchors.push(anchor)

						} else if (lua_api.namespaces[_parent.nodeValue]){
							const anchor = "<a href='#Namespaces-" + _parent.nodeValue + "-" + link.f + "'>" + text + "</a>"
							anchors.push(anchor)

						} else {
							// there doesn't seem to be any case to handle this in Lua.xsl
						}

					} else {
						const anchor = "<a href='#GlobalFunctions-" + link.f + "'>" + text + "</a>"
						anchors.push(anchor)
					}


				// Linking to a class/namespace.
				} else if (link.c !== undefined && link.f === undefined){

					const text = link.t !== "" ? link.t : link.c
					let anchor

					// linking to a particular ActorClass
					if (lua_api.actor_class_names[link.c]){
			 			anchor = "<a href='#Actors-" + link.c + "'>" + text + "</a>"

					// linking to a particular Namespace
					} else if (lua_api.namespaces[link.c]){
						anchor = "<a href='#Namespaces-" + link.c + "'>" + text + "</a>"

					// linking somewhere else in the document
					} else {
						anchor = "<a href='#" + link.c + "'>" + text + "</a>"
					}

					anchors.push(anchor)


				// Linking to a global function or an enum.
				} else if ((link.c === "GLOBAL" || link.c === "ENUM") && (link.f !== undefined)){

					const text = link.t !== "" ? link.t : link.f

					if (link.c === "GLOBAL"){
						// create the anchor string for this Global Function
			 			const anchor = "<a href='#GlobalFunctions-" + link.f + "'>" + text + "</a>"
						anchors.push(anchor)

					} else if (link.c === "ENUM") {
						// create the anchor string for this Enum
						const anchor = "<a href='#Enums-" + link.f + "'>" + text + "</a>"
						anchors.push(anchor)
					}


				// Linking to a function in a class/namespace.
				} else if (link.c !== undefined && link.f !== undefined) {

					// if this was a <Link>text</Link> element, use the text provided
					// if this was a self-closing link, use class.function and append "()"
					const text = link.t !== "" ? link.t : (link.c + "." + link.f + "()")
					let anchor = ""

					// ensure that link.c matches an ActorClass before creating an anchor to it
					// lua_api.actor_class_names is a convenience object with string keys that match ActorClass names
					if (lua_api.actor_class_names[link.c]){
						anchor = "<a href='#Actors-" + link.c + "-" + link.f + "'>" + text + "</a>"


					// if link.c wasn't an ActorClass, look for it in Namespaces next
					// lua_api.namespaces is a convenience object with string keys that match Namespaces
					} else if (lua_api.namespaces[link.c]){
						anchor = "<a href='#Namespaces-" + link.c + "-" + link.f + "'>" + text + "</a>"


					// <Link> element was found with no documentation to link to...
					// a current example is <Link class='ThemePrefs' function='Get' />
					} else {
						anchor = "<code>" + text + "</code>"
					}

					anchors.push(anchor)
				}

				// else "Ignore this Link."

			}

			$(element).find("Link").each(function(i, obj){
				$(this).replaceWith(anchors[i])
			})

			return element.innerHTML.trim()
		}

		// ---------------------------------------------------------------------

		$.ajax({
			url: "./Luadoc/LuaDocumentation.xml"

		}).done(function(lua_documentation){

			$.ajax({
				url: "./Luadoc/Lua.xml"
			}).done(function(lua_dot_xml){

				const lua_doc_children     = $(lua_documentation).children()
				const lua_dot_xml_children = $(lua_dot_xml).children()

				// We have two xml files to retrieve data from, lua_documentation and lua_dot_xml
				// Most Actor classes are *described* in LuaDocumentation.xml, but not all.
				// Lua.xml, on the other hand, is supposed to be autogenerated from the SM engine
				// using the command-line argument "--ExportLuaInformation"
				// All available classes and methods should be in Lua.xml, but not everything has a
				// corresponding explanation in LuaDocumentation.xml
				const documentation = {
					actors:           lua_doc_children.find("Classes"),
					namespaces:       lua_doc_children.find("Namespaces"),
					global_functions: lua_doc_children.find("GlobalFunctions"),
					enums:            lua_doc_children.find("Enums"),
				}

				const actors           = Array.from(lua_dot_xml_children.find("Classes Class"))
				const namespaces       = Array.from(lua_dot_xml_children.find("Namespaces Namespace"))
				const enums            = Array.from(lua_dot_xml_children.find("Enums Enum"))
				const singletons       = Array.from(lua_dot_xml_children.find("Singletons Singleton"))
				const global_functions = Array.from(lua_dot_xml_children.find("GlobalFunctions Function"))
				const constants        = Array.from(lua_dot_xml_children.find("Constants Constant"))

				// actor classes, namespaces, enums, singletons, global functions, constants
				let data = [ [], [], [], [], [], [] ]


				// ---------------------------------------------------------------------
				// first, populate lua_api.singletons object with the names of each singleton and retain it as state
				singletons.forEach(s => lua_api.singletons[s.attributes.class.textContent] = true)

				// next, do similarly with lua_api.actor_class_names, filling it with the names of each stepmania class
				actors.forEach(actor => {
					const class_name = actor.attributes.name.textContent

					// don't add singletons here
					if (!(class_name in lua_api.singletons)){
						lua_api.actor_class_names[class_name] = true
					}
				})

				// also include the SM5 Lua Namespace names
				namespaces.forEach(namespace => lua_api.namespaces[namespace.attributes[0].nodeValue] = true)
				// and Enums strings, too
				enums.forEach(e => lua_api.enums[e.attributes.name.textContent] = true)

				lua_api.bubbleDataUp()



				// now, do the "heavy lifting"
				// ---------------------------------------------------------------------
				// process each actor_class...
				actors.forEach(function(actor_class){

					const class_name = actor_class.attributes.name.textContent

					// if this class is a singleton, skip to the next forEach iteration
					// so its methods and description don't get put in with ActorClass methods
					if (lua_api.singletons[class_name]){ return }

					const class_doc  = $(documentation.actors).find("Class[name=" + class_name + "]")

					let unsorted_methods = Array.from($(actor_class).find("Function"))

					// ... sorting each actor class's methods alphabetically, in a case-insensitive manner ...
					unsorted_methods.sort(function(a,b){
						// I'm pretty sure all the text I'm sorting here falls within the ASCII range of 32-126
						// otherwise, I might not be able to rely on doing greater-than less-than comparisons like this
						// for discussion, see: https://stackoverflow.com/q/14677060
						if (a.attributes.name.textContent.toUpperCase() < b.attributes.name.textContent.toUpperCase()){ return -1}
						if (a.attributes.name.textContent.toUpperCase() > b.attributes.name.textContent.toUpperCase()){ return 1}
						return 0
					})

					// ... and get just the method data we want (name, return, args, description) for each method
					const sorted_methods = unsorted_methods.map(function(method, i){

						const method_name = method.attributes.name.textContent
						const method_doc  = $(class_doc).find("Function[name=" + method_name + "]")

						return {
							name: method_name,
							return: lua_api.getReturnValue( method_doc.attr("return") ),
							arguments: method_doc.attr("arguments") || "",
							desc: check_for_links(method_doc[0])
						}
					})

					// some Actor classes have <Description> tags which contain text describing the overall class
					const class_desc = class_doc.find("Description")[0]

					// push a new object representing this actor_class to the overall data array
					data[0].push({
						name: actor_class.attributes.name.textContent,
						base: actor_class.attributes.base !== undefined ? actor_class.attributes.base.textContent : undefined,
						desc: check_for_links(class_desc),
						methods: sorted_methods
					})
				})

				// ---------------------------------------------------------------------
				// next, process each namespace...
				namespaces.forEach(function(namespace){
					const namespace_name = namespace.attributes.name.textContent
					const namespace_doc = $(documentation.namespaces).find("Namespace[name=" + namespace_name + "]")

					const _funcs = Array.from($(namespace).find("Function"))

					const funcs = _funcs.map(function(func, i){
						const func_name = func.attributes.name.textContent
						const func_doc  = $(documentation.namespaces).find("Function[name=" + func_name + "]")[0]
						return {
							name: func.attributes.name.textContent,
							return: func_doc !== undefined ? lua_api.getReturnValue( func_doc.attributes.return.textContent ) : "",
							arguments: func_doc !== undefined ? func_doc.attributes.arguments.textContent : "",
							desc: check_for_links(func_doc)
						}
					})

					// some namespaces have <Description> tags which contain text describing the overall class
					const namespace_desc = $(namespace_doc).find("Description")[0]

					data[1].push({
						name: namespace.attributes.name.textContent,
						methods: funcs,
						desc: check_for_links(namespace_desc),
					})
				})

				// ---------------------------------------------------------------------
				// next, process each enum...
				enums.forEach(function(e){
					const enum_name = e.attributes.name.textContent
					const enum_doc  = $(documentation.enums).find("Enum[name=" + enum_name + "]")
					const enum_desc = enum_doc.find("Description")[0]

					const _values   = Array.from($(e).find("EnumValue"))
					const values = _values.map(function(v, i){
						return {
							name: v.attributes.name.textContent,
							value: v.attributes.value.textContent
						}
					})

					data[2].push({
						name: enum_name,
						values: values,
						desc: check_for_links(enum_desc)
					})
				})

				// ---------------------------------------------------------------------
				// almost done now; process each singleton...
				singletons.forEach(function(s){
					const sm_class = s.attributes.class.textContent
					const _name    = s.attributes.name.textContent
					const _doc     = $(documentation.actors).find("Class[name=" + sm_class + "]")
					const _desc    = _doc.find("Description")[0]

					const _methods = Array.from(_doc.find("Function")).map(function(method, i){

						const method_name = method.attributes.name.textContent
						const method_doc  = $(_doc).find("Function[name=" + method_name + "]")

						return {
							name: method_name,
							return: lua_api.getReturnValue( method_doc.attr("return") ),
							arguments: method_doc.attr("arguments") || "",
							desc: check_for_links(method_doc[0])
						}
					})

					data[3].push({
						sm_class: sm_class,
						name: _name,
						methods: _methods,
						desc: check_for_links(_desc)
					})
				})

				// ---------------------------------------------------------------------
				// almost done! process each global function...
				global_functions.forEach(function(f){
					const gfunc_name = f.attributes.name.textContent
					const gfunc_doc  = $(documentation.global_functions).find("Function[name=" + gfunc_name + "]")[0]

					data[4].push({
						name: f.attributes.name.textContent,
						return: gfunc_doc !== undefined ? gfunc_doc.attributes.return.textContent : "",
						arguments: gfunc_doc !== undefined ? gfunc_doc.attributes.arguments.textContent : "",
						desc: check_for_links(gfunc_doc)
					})
				})

				// ---------------------------------------------------------------------
				// finally! process each Lua constant, and we're done
				constants.forEach(function(c){
					data[5].push({
						name: c.attributes.name.textContent,
						value: c.attributes.value !== undefined ? c.attributes.value.textContent : ""
					})
				})

				// ---------------------------------------------------------------------
				// store all render-able elements now so that we don't need to constantly recompute them
				// lua_api.all_elements = lua_api.getElementsToRender()

				// ---------------------------------------------------------------------
				// we're out of the "heavy lifting" forEach loop; it's time to setState
				lua_api.setState({
					isLoaded: true,
					data: data,
				})

				// trigger a custom page scroll now
				lua_api.scroll_window_after_hashchange()

				// and set up future hashchanges to use the custom scroll as well
				props.history.listen((location, action) => {
					lua_api.scroll_window_after_hashchange(location.hash)
				})
			})
		})
	}

	bubbleDataUp(){
		this.props.parentCallback({
			actor_classes: Object.keys(this.actor_class_names),
			namespaces: Object.keys(this.namespaces),
			enums: Object.keys(this.enums),
			singletons: Object.keys(this.singletons)
		})
	}

	updateHash(hash){
		window.location.hash = "#" + hash
	}

	scroll_window_after_hashchange(hash){
		hash = (hash || window.location.hash)

		if (hash) {
			hash = hash.replace("#","")
			const el = document.getElementById(hash)
			if (el){
				const y_offset = el.offsetTop
				if (y_offset){
					const topbar_height = this.props.mobile_nav ? 128 : 75
					window.scrollTo(0, y_offset-topbar_height)
				}
			}
		}
	}

	getElementsToRender(){

		const filter = this.props.text_filter

		return {
			"Actors": this.state.data[0].map(function(a, i){
				return <ActorClass actor={a} key={a.name} text_filter={filter} />
			}),

			"Namespaces": this.state.data[1].map(function(n, i){
				return <Namespace namespace={n} key={n.name} text_filter={filter} />
			}),

			"Enums": this.state.data[2].map(function(e, i){
				return <Enum enum={e} key={e.name} text_filter={filter} />
			}),

			"Singletons": this.state.data[3].map(function(s, i){
				return <Singleton singleton={s} key={s.name} text_filter={filter} />
			}),

			"GlobalFunctions": (<GlobalFunctions global_functions={this.state.data[4]} text_filter={filter} /> ),

			"Constants": (
				<table id={"Constants"} className="table table-hover table-sm table-bordered">
					<thead className="table-primary"><tr><th><strong>Lua Variable</strong></th><th>Value</th></tr></thead>
					<tbody>
						{this.state.data[5].map(function(c, i){
							return(
								<tr key={"constant-"+c.name}>
									<td>{c.name}</td>
									<td>{c.value}</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			)
		}
	}


	// a helper function to determine whether the "return" type of each API method
	// should be static text or an anchor linking to elsewhere in the document
	getReturnValue(r){
		if (r === undefined) { return "" }

		// if the return text for this method exactly matches "void" just use that
		if (r === "void"){ return r }

		// next, check to see if the return text matches any of the actor classes
		if (this.actor_class_names[r]){
			return "<a href='#Actors-" + r +"'>" + r + "</a>"
		}

		// maybe this method's return value is an Actor wrapped in curly braces
		// indicating that this method returns a table of Actors
		// (though, it could also be "float" wrapped in curly braces,
		// which we don't want to try to try to create an anchor to)
		const _r = r.match(/{(.+)}/)
		if (_r && this.actor_class_names[_r[1]]){
			return "{ <a href='#Actors-" + _r[1] +"'>" + _r[1] + "</a> }"
		}

		// otherwise, we have something like "bool" or "int"; just return it
		return r
	}


	// -----------------------------------------------------------------------------------------
	// API TEXT FILTER
	// -----------------------------------------------------------------------------------------


	// this method exists to handle the text-input field that appears in mobile layout
	handleFilterChange(eventValue){
		this.props.parentFilterChange({text_filter: eventValue})
	}


	// -----------------------------------------------------------------------------------------
	// -----------------------------------------------------------------------------------------


	render() {

		if (this.state === undefined || this.state.isLoaded === false){ return null }

		// ---------------------------------------------------------------------
		// let elements = null
		const elements = this.getElementsToRender()

		// by default there are 22 constants, but text filtering may result in fewer or none
		// so, store the curent number of constants in num_constants now and use it below
		// to determine whether to show/hide the header for the constants table
		// (having a table header with 0 rows of data is confusing)
		const num_constants = elements.Constants.props.children[1].props.children.length

		return (
			<div className="LuaAPI pl-md-4">

				<p className="alert alert-info">
					This version of SM5&apos;s Lua API doc is in beta, so some information may be missing!
					<br /><br />
					The original, full API doc can <a href="/Lua-For-SM5/Luadoc/Lua.xml">still be accessed here</a>.
				</p>

				{
					// set a bootstrap class of display-none when mobile_nav prop is true to hide this div
					// when the mobile navigation menu (should fill the entire the screen) is active
					// otherwise, use d-md-none so that this div only appears when bootstrap detects page
					// width is smaller than md
				}
				<div className={(this.props.mobile_nav ? "d-none" : "d-md-none") + " sticky-top mobile-filter"}>

					{
						// hack: pad the LuaAPIFilter component down a bit via <br> so that
						// it doesn't appear under the navbar when sticky-top takes effect
					}
					<span>
						<br /> <br /><br />
					</span>

					<LuaAPIFilter onFilterChange={this.handleFilterChange} />
					<hr />
				</div>


				<h1>SM5 Lua API</h1>

				<h2 id="Actors" className="API-Category">
					<Octicon onClick={() => this.updateHash("Actors")} name="link" />
					Classes
				</h2>
				<div>{elements.Actors}</div>

				<h2 id="Singletons" className="API-Category">
					<Octicon onClick={() => this.updateHash("Singletons")} name="link" />
					Singletons
				</h2>
				<div>{elements.Singletons}</div>

				<h2 id="Namespaces" className="API-Category">
					<Octicon onClick={() => this.updateHash("Namespaces")} name="link" />
					Namespaces
				</h2>
				<div>{elements.Namespaces}</div>

				<h2 id="Enums" className="API-Category">
					<Octicon onClick={() => this.updateHash("Enums")} name="link" />
					Enums
				</h2>
				<div>{elements.Enums}</div>

				<h2 id="GlobalFunctions" className="API-Category">
					<Octicon onClick={() => this.updateHash("GlobalFunctions")} name="link" />
					Global Functions
				</h2>
				<div>{elements.GlobalFunctions}</div>

				<h2 id="Constants" className="API-Category">
					<Octicon onClick={() => this.updateHash("Constants")} name="link" />
					Constants
				</h2>
				<div>{num_constants > 0 && elements.Constants}</div>
			</div>
		)
	}
}

export default LuaAPI;