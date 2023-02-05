import { Component } from "react"

import SectionSMClass        from "./SectionSMClass"
import SectionEnum           from "./SectionEnum"
import SectionGlobalFunction from "./SectionGlobalFunction"
import SectionConstants      from "./SectionConstants"

// ------- jQuery for parsing the existing XML files
// -------    where most of the documentation is
import $ from "jquery"

// ------- highlightjs sot that multiline <code> blocks can
// -------     have syntax coloring
import hljs from "highlight.js"

// ------- custom stylesheet for LuaAPI
import "../_styles/api.css"

import { default_url } from "./modules/SupportedAPIs.js"


class LuaAPI extends Component {

	constructor(props){
		super()

		this.state = {
			isLoaded: false,
			selectedAPIurl: default_url,
		}

		// docs will contain documentation data read in from outside files
		// Lua.xml, LuaDocumentation.xml, and FunctionDefinitions.csv
		this.docs = {
			github: {},
		}

		this.sections = [ "Actors", "Screens", "Classes", "Singletons", "Namespaces", "Enums" ]

		// pojos containing just the actor/singleton class names, namespace names, and enum strings as keys
		// used for convenient lookup in getReturnValue() and to pass up to LuaAPISidebar
		for (const i in this.sections){
			this[this.sections[i]] = {}
		}

		// ensure that the following functions have access to "this"
		this.fetchAndParseXML = this.fetchAndParseXML.bind(this)
		this.getReturnValue   = this.getReturnValue.bind(this)
		this.bubbleDataUp     = this.bubbleDataUp.bind(this)

		// trigger a custom page scroll now
		this.scroll_window_after_hashchange()
	}

	// ---------------------------------------------------------------------

	// some class and method descriptions contain <Link> elements,
	// intended to serve as anchors to elsewhere within the document
	// we need to find and replace them with html-compliant anchors
	check_for_links(element){
		if (element === undefined){ return "" }

		// maintain a handle on this class to be used within the functions below
		const lua_api = this
		const anchors = []

		for (const l of element.find("Link")){

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

			// class attribute is absent and function attribute is present
			// so we're linking to a function in the current class/namespace.
			if (link.c === undefined && link.f !== undefined){

				// It was possible in LuaDocumentation.xml to create a <Link> to some other method
				// *within* the current Class using a compact syntax like <Link function="zoomy"/>
				// Unfortunately, that leaves us trying to figure out what the "current Class" is
				// in the context of this React app.  We'll get the parentNode of the method object.

				const parent_name = element.parent().attr("name")
				const text = link.t !== "" ? link.t : link.f

				if (parent_name){

					// check Actors, Screens, Classes, Singletons, Namespaces, and Enums first
					for (const i in lua_api.sections){
						if (lua_api[lua_api.sections[i]][parent_name]){
							anchors.push( `<a href="#${lua_api.sections[i]}-${parent_name}-${link.f}">${text}</a>` )
							break
						}
					}

				// if not, assume we're linking to a GlobalFunction
				} else {
					anchors.push( `<a href="#GlobalFunctions-${link.f}">${text}</a>` )
				}


			// class attribute is present and function attribute is absent
			// so we're linking to a class/namespace
			} else if (link.c !== undefined && link.f === undefined){

				const text = link.t !== "" ? link.t : link.c
				// e.g. <Link class='Enums' />
				let anchor = `<a href='#${link.c}'>${text}</a>`

				for (const i in lua_api.sections){
					if (lua_api[lua_api.sections[i]][link.c]){
						// e.g. <Link class='LifeMeter' />
						anchor = `<a href='#${lua_api.sections[i]}-${link.c}'>${text}</a>`
						break
					}
				}

				anchors.push(anchor)


			// Linking to a global function or an enum.
			} else if ((link.c === "GLOBAL" || link.c === "ENUM") && (link.f !== undefined)){

				const text = link.t !== "" ? link.t : link.f

				if (link.c === "GLOBAL"){
					// create the anchor string for this Global Function
					anchors.push( `<a href='#GlobalFunctions-${link.f}'>${text}</a>` )

				} else if (link.c === "ENUM") {
					// create the anchor string for this Enum
					anchors.push( `<a href='#Enums-${link.f}'>${text}</a>` )
				}


			// Linking to a function in a class/namespace.
			} else if (link.c !== undefined && link.f !== undefined) {

				let anchor

				// ensure that link.c matches an ActorClass before creating an anchor to it
				// lua_api.Classes is a convenience object with string keys that match Class names
				for (const i in lua_api.sections){
					if (lua_api[lua_api.sections[i]][link.c] ){

						let text
						// if this was a <Link>text</Link> element, use the text provided
						// if this was a self-closing link, use class.function and append "()"
						if (lua_api.sections[i] === "Singletons"){
							text = link.t !== "" ? link.t : (`${lua_api.Singletons[link.c]}:${link.f}()`)
						} else {
							text = link.t !== "" ? link.t : (`${link.c}.${link.f}()`)
						}

						anchor = `<a href='#${lua_api.sections[i]}-${link.c}-${link.f}'>${text}</a>`
						break
					}
				}

				// <Link> element was found with no documentation to link to...
				// a current example is <Link class='ThemePrefs' function='Get' />
				if (anchor === undefined){
					anchor = "<code>" + (link.t !== "" ? link.t : (link.c + "." + link.f + "()")) + "</code>"

				}

				anchors.push(anchor)
			}

			// else ignore this <Link>.
		}

		$(element).find("Link").each(function(i, obj){
			$(this).replaceWith(anchors[i])
		})

		$(element).find("pre code").each(function(i, code){
			// trim leading newline if one is found
			const txt = code.textContent.charAt(0)==="\n" ? code.textContent.substr(1) : code.textContent
			$(code).replaceWith("<code class='lua'>" + txt + "</code>")
		})

		return (element.html() || "").trim()
	}

	// ---------------------------------------------------------------------
	// a helper function to determine whether the "return" type of each API method
	// should be static text or an anchor linking to elsewhere in the document

	getReturnValue(r){
		if (r === undefined) { return "" }

		// if the return text for this method exactly matches "void" just use that
		if (r === "void"){ return r }

		// maybe this method's return value is wrapped in curly braces
		// indicating that this method returns a table of something
		const _r = r.match(/{(.+)}/)
		if (_r) { r = _r[1] }

		let anchor

		const _sections = ["Classes", "Actors", "Screens", "Enums"]
		for (const i in _sections){
			if (this[_sections[i]][r]){
				anchor = `<a href='#${_sections[i]}-${r}'>${r}</a>`
				break
			}
		}

		if (anchor === undefined){
			// otherwise, we have something like "bool" or "int"; just return it
			anchor = r
		}

		return (_r ? "{ " : "") + anchor + (_r ? " }" : "")
	}

	// ---------------------------------------------------------------------

	componentDidUpdate(){
		this.scroll_window_after_hashchange()

		if (this.props.selectedAPIurl !== undefined){
			if (this.state.selectedAPIurl !== this.props.selectedAPIurl){
				const lua_api = this
				this.setState({	selectedAPIurl: this.props.selectedAPIurl }, () => {
					lua_api.fetchAndParseXML()
				})
			}
		}
	}

  // called once after initial page load
	componentDidMount(){
		this.fetchAndParseXML()
	}

	fetchAndParseXML(){
		// maintain a handle on this class to be used within the functions below
		const lua_api = this


		// --------------------------------
		// reset the visible API doc
		// XXX: make this a reusable function?
		for (const i in this.sections){
			this[this.sections[i]] = {}
		}
		lua_api.setState({
			isLoaded: false,
			G: null,
		})
		// --------------------------------

		// ---------------------------------------------------------------------
		// get documentation files using jQuery
		// then parse them into a usable data structure for this React app

		const url = this.state.selectedAPIurl

		// ------------------------

		$.when(

			// We have three xml files to retrieve data from:
			//   Lua.xml
			//      a list of classes and functions, autogenerated using the CLI argument
			//      "--ExportLuaInformation" when starting StepMania
			//   LuaDocumentation.xml
			//      corresponding descriptions of classes and functions listed in Lua.xml
			//      this file is manually kept up-to-date by humans
			//   FunctionDefs.json
			//      additional metadata, specific to this Lua-for-SM5 project
			//      autogenerated when the AuxiliaryLuadocData.lua file included with this
			//      project is added to a StepMania theme
			//
			// All classes, methods, functions, etc. should be in Lua.xml, but not everything
			// has a corresponding explanation written by a human in LuaDocumentation.xml

			// ------------------------
			// $.get() returns a string
			// use jquery's .parseXML() to convert that string to an XMLDocument

			$.get(url + "LuaDocumentation.xml", (luadoc) => {
				lua_api.docs.luadoc = $($.parseXML(luadoc)).children()
			}),

			$.get(url + "Lua.xml", (luadotxml) => {
				lua_api.docs.luadotxml = $($.parseXML(luadotxml)).children()
			}),

			$.get("./Luadoc++/FunctionDefs.json", (funcdefs) => {
				lua_api.docs.github.funcdefs = funcdefs;
			})

		).then(function(){

			const documentation = {
				classes:          lua_api.docs.luadoc.children("Classes"),
				actors:           lua_api.docs.luadoc.children("Actors"),
				screens:          lua_api.docs.luadoc.children("Screens"),
				namespaces:       lua_api.docs.luadoc.children("Namespaces"),
				enums:            lua_api.docs.luadoc.children("Enums"),
				singletons:       lua_api.docs.luadoc.children("Singletons"),
				global_functions: lua_api.docs.luadoc.children("GlobalFunctions"),
				constants:        lua_api.docs.luadoc.children("Constants"),
			}

			const classes          = Array.from(lua_api.docs.luadotxml.children("Classes").children("Class"))
			const namespaces       = Array.from(lua_api.docs.luadotxml.children("Namespaces").children("Namespace"))
			const enums            = Array.from(lua_api.docs.luadotxml.children("Enums").children("Enum"))
			const singletons       = Array.from(lua_api.docs.luadotxml.children("Singletons").children("Singleton"))
			const global_functions = Array.from(lua_api.docs.luadotxml.children("GlobalFunctions").children("Function"))
			const constants        = Array.from(lua_api.docs.luadotxml.children("Constants").children("Constant"))

			// ---------------------------------------------------------------------
			// sort arrays alphabetically; sorting now ensures sequence within sidebar expandables
			// matches sequence in document

			const sortByAttr = function(attr){
			  return function(a, b){
					if ($(a).attr(attr).toUpperCase() < $(b).attr(attr).toUpperCase()){ return -1}
					if ($(a).attr(attr).toUpperCase() > $(b).attr(attr).toUpperCase()){ return 1}
					return 0
				}
			}

			classes.sort(sortByAttr("name"))
			namespaces.sort(sortByAttr("name"))
			enums.sort(sortByAttr("name"))
			singletons.sort(sortByAttr("class"))

			// not sorted for now; these don't have expandable lists in the sidebar
			// TODO: think about how to helpfully organize Global Functions
			// global_functions.sort(sortByAttr("name"))
			// constants.sort(sortByAttr("name"))

			// ---------------------------------------------------------------------
			// first, populate lua_api.Singletons object with the names of each singleton and retain it as state
			singletons.forEach(s => lua_api.Singletons[s.attributes.class.textContent] = s.attributes.name.textContent)
			// also include the SM5 Lua Namespace names
			namespaces.forEach(namespace => lua_api.Namespaces[namespace.attributes[0].nodeValue] = true)
			// and Enums strings, too
			enums.forEach(e => lua_api.Enums[e.attributes.name.textContent] = true)

			// next, do similarly with lua_api.Classes, filling it with the names of
			// each stepmania class.  Note that lua_api.Classes contains info for what
			// this React app presents as "Actors", "Screens", "Other Classes", and Singletons!
			classes.forEach(cls => {
				const class_name = cls.attributes.name.textContent

				// don't add singletons here; those have already been added to lua_api.Singletons
				// just skip to the next classes.forEach iteration
				if (class_name in lua_api.Singletons){ return }

				const class_doc = $(documentation.classes).find("Class[name=" + class_name + "]")
				const grouping  = class_doc.attr("grouping") || "SMClass"
				const mapping = {
					Actor: "Actors",
					Screen: "Screens",
					SMClass: "Classes",
				}

				lua_api[mapping[grouping]][class_name] = true
			})

			lua_api.bubbleDataUp()

			// ---------------------------------------------------------------------

			const G = [
				{ data: [], desc: lua_api.check_for_links(documentation.actors.children("Description")) },           // 0: actors
				{ data: [], desc: lua_api.check_for_links(documentation.screens.children("Description")) },          // 1: screens
				{ data: [], desc: lua_api.check_for_links(documentation.classes.children("Description")) },          // 2: classes
				{ data: [], desc: lua_api.check_for_links(documentation.namespaces.children("Description")) },       // 3: namespaces
				{ data: [], desc: lua_api.check_for_links(documentation.enums.children("Description")) },            // 4: enums
				{ data: [], desc: lua_api.check_for_links(documentation.singletons.children("Description")) },       // 5: singletons
				{ data: [], desc: lua_api.check_for_links(documentation.global_functions.children("Description")) }, // 6: global_functions
				{ data: [], desc: lua_api.check_for_links(documentation.constants.children("Description")) },        // 7: constants
			]

			// ---------------------------------------------------------------------
			// process each actor_class...

			classes.forEach(function(sm_class){

				const class_name = $(sm_class).attr("name")

				// if this class is a singleton, skip to the next forEach iteration
				// so its methods and description don't get put in with actor, screen, or class methods
				if (lua_api.Singletons[class_name]){ return }

				const class_doc = $(documentation.classes).find("Class[name=" + class_name + "]")

				let unsorted_methods = Array.from($(sm_class).find("Function"))

				// ... sorting each actor class's methods alphabetically, in a case-insensitive manner ...
				unsorted_methods.sort(function(a,b){
					// I'm pretty sure all the text I'm sorting here falls within the ASCII range of 32-126
					// otherwise, I might not be able to rely on doing greater-than less-than comparisons like this
					// for discussion, see: https://stackoverflow.com/q/14677060
					if (a.attributes.name.textContent.toUpperCase() < b.attributes.name.textContent.toUpperCase()){ return -1}
					if (a.attributes.name.textContent.toUpperCase() > b.attributes.name.textContent.toUpperCase()){ return 1}
					return 0
				})

				// ... and get just the method data we want (name, return, args, desc, url to GitHub) for each method
				const sorted_methods = unsorted_methods.map(function(method, i){

					const method_name = $(method).attr("name")
					const method_doc  = $(class_doc).find("Function[name=" + method_name + "]")

					return {
						name: method_name,
						return: lua_api.getReturnValue( method_doc.attr("return") ),
						arguments: method_doc.attr("arguments") || "",
						desc: lua_api.check_for_links(method_doc),
						url: lua_api.docs.github.funcdefs[class_name] && lua_api.docs.github.funcdefs[class_name][method_name]
					}
				})

				const class_grouping = class_doc.attr("grouping") || "SMClass"
				const index = {
					Actor: 0,
					Screen: 1,
					SMClass: 2,
				}

				const group_mapping = {
					Actor: "Actors",
					Screen: "Screens",
					SMClass: "Classes",
				}
				const base = $(sm_class).attr("base")
				let base_grouping = undefined

				if (base !== undefined){
					const base_doc = $(documentation.classes).find("Class[name=" + base + "]")
					base_grouping = group_mapping[(base_doc.attr("grouping") || "SMClass")]
				}

				// push a new object representing this sm_class to the overall data array
				G[index[class_grouping]].data.push({
					name: class_name,
					base: sm_class.attributes.base !== undefined ? {name: base, grouping: base_grouping} : undefined,
					desc: lua_api.check_for_links(class_doc.find("Description")),
					methods: sorted_methods,
					grouping: group_mapping[class_grouping],
				})
			})

			// ---------------------------------------------------------------------
			// next, process each namespace...
			namespaces.forEach(function(namespace){
				const _name = $(namespace).attr("name")
				const _doc  = $(documentation.namespaces).find("Namespace[name=" + _name + "]")
				const funcs = []

				$(namespace).children("Function").each(function(i,func){
					const fname = $(func).attr("name")
					const fdoc  = $(documentation.namespaces).find("Function[name=" + fname + "]")
					funcs.push({
						name: $(func).attr("name"),
						return: lua_api.getReturnValue( fdoc.attr("return") ),
						arguments: fdoc.attr("arguments") || "",
						desc: lua_api.check_for_links(fdoc)
					})
				})

				G[3].data.push({
					name: _name,
					methods: funcs,
					desc: lua_api.check_for_links(_doc.find("Description")),
					grouping: "Namespaces"
				})
			})

			// ---------------------------------------------------------------------
			// next, process each enum...
			enums.forEach(function(e){
				const _name = $(e).attr("name")
				const _doc  = $(documentation.enums).find("Enum[name=" + _name + "]")
				const values = []

				$(e).children("EnumValue").each(function(i, v){
					values.push({
						name: $(v).attr("name"),
						value: $(v).attr("value")
					})
				})

				G[4].data.push({
					name:  _name,
					values: values,
					desc: lua_api.check_for_links(_doc.find("Description"))
				})
			})

			// ---------------------------------------------------------------------
			// almost done now; process each singleton...
			singletons.forEach(function(s){
				const sm_class = $(s).attr("class")
				const _doc     = $(documentation.classes).find("Class[name=" + sm_class + "]")

				const methods = Array.from(_doc.find("Function")).map(function(method, i){

					const method_name = $(method).attr("name")
					const method_doc  = $(_doc).find("Function[name=" + method_name + "]")

					return {
						name: method_name,
						return: lua_api.getReturnValue( method_doc.attr("return") ),
						arguments: method_doc.attr("arguments") || "",
						desc: lua_api.check_for_links(method_doc),
						url: lua_api.docs.github.funcdefs[sm_class] && lua_api.docs.github.funcdefs[sm_class][method_name]
					}
				})

				G[5].data.push({
					name: sm_class,
					methods: methods,
					desc: lua_api.check_for_links(_doc.find("Description")),
					grouping: "Singletons"
				})
			})

			// ---------------------------------------------------------------------
			// almost done! process each global function...
			global_functions.forEach(function(f){
				const _name = $(f).attr("name")
				const _doc  = $(documentation.global_functions).find("Function[name=" + _name + "]")
				const theme = _doc.attr("theme")

				// don't show Global Functions from the Default theme here; most
				// themes will not use it as their base and won't have its functions
				// just skip to the next forEach() iteration
				if (theme === "default"){ return }

				G[6].data.push({
					name: _name,
					return: lua_api.getReturnValue( _doc.attr("return") ),
					arguments: _doc.attr("arguments"),
					desc: lua_api.check_for_links(_doc),
					theme: _doc.attr("theme") || "",
					url: lua_api.docs.github.funcdefs.GlobalFunctions[_name],
					grouping: "GlobalFunctions"
				})
			})

			// ---------------------------------------------------------------------
			// finally! process each Lua constant, and we're done
			constants.forEach(function(c){
				G[7].data.push({
					name: $(c).attr("name"),
					value: $(c).attr("value") || ""
				})
			})

			// ---------------------------------------------------------------------
			// we're out of the heavy lifting forEach loop; it's time to setState
			lua_api.setState({
				isLoaded: true,
				G: G,
			}, () => {
				lua_api.bubbleDataUp()
			})

		}).then(function(){
			// highlightjs
			document.querySelectorAll("pre code").forEach(block => {
				hljs.highlightElement(block);
			})

			// this second .then() handler is VERY likely to called after React
			// has already mounted the LuaAPI component
			// so once we are here, trigger a window scroll to ensure the user
			// is the correct section of the document
			lua_api.scroll_window_after_hashchange()
		})
	}

	bubbleDataUp(){
		this.props.parentCallback({
			actors:     Object.keys(this.Actors),
			screens:    Object.keys(this.Screens),
			sm_classes: Object.keys(this.Classes),
			namespaces: Object.keys(this.Namespaces),
			enums:      Object.keys(this.Enums),
			singletons: Object.keys(this.Singletons),
			isLoaded: this.state.isLoaded,
		})
	}

	updateHash(hash){
		window.location.hash = "#" + hash
	}

	scroll_window_after_hashchange(hash){
		hash = (hash || window.location.hash)

		if (hash) {
			// hack: use hyphens in the url hash as a way of measuring "depth"
			// that is, are we on #Screens, #Screens-Screen, or #Screens-Screen-AddInputCallback
			// offset by different amounts to accommodate sticky headers
			const depth = (hash.match(/-/g) || []).length

			hash = hash.replace("#","")
			const el = document.getElementById(hash)
			if (el){
				const y_offset = el.offsetTop
				if (y_offset){
					const topbar_height = depth > 1 ? 108 : 60

					// offset for #GlobalFunctions-[thing] is special-cased for now
					const h3_height = depth > 0 && hash.substring(0, 15)==="GlobalFunctions" ? 40 : 0

					window.scrollTo(0, y_offset - topbar_height - h3_height)
				}
			}
		}
	}


	// -----------------------------------------------------------------------------------------
	// -----------------------------------------------------------------------------------------


	render() {

    if (this.state === undefined || this.state.isLoaded === false){ return null }

		// ---------------------------------------------------------------------

		return (
			<div className="LuaAPI ps-md-4">

				<div className="alert alert-info">
					<span role="img" aria-label="info">ℹ️</span> The original API doc can still be found <a target="_blank" rel="noopener noreferrer" href="/Lua-For-SM5/Luadoc/Lua.xml">here</a>.
				</div>


				<h1>SM5 Lua API</h1>

				<SectionSMClass        name="Actors"          desc={this.state.G[0].desc} data={this.state.G[0].data} />
				<SectionSMClass        name="Screens"         desc={this.state.G[1].desc} data={this.state.G[1].data} />
				<SectionSMClass        name="Classes"         desc={this.state.G[2].desc} data={this.state.G[2].data} />
				<SectionSMClass        name="Singletons"      desc={this.state.G[5].desc} data={this.state.G[5].data} />
				<SectionSMClass        name="Namespaces"      desc={this.state.G[3].desc} data={this.state.G[3].data} />
				<SectionEnum           name="Enums"           desc={this.state.G[4].desc} data={this.state.G[4].data} />
				<SectionGlobalFunction name="GlobalFunctions" desc={this.state.G[6].desc} data={this.state.G[6].data} />
				<SectionConstants      name="Constants"       desc={this.state.G[7].desc} data={this.state.G[7].data} />
			</div>
		)
	}
}

export default LuaAPI;
