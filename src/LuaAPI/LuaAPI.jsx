import React, { Component } from "react";

import ActorClass from "./ActorClass"
import ActorMethod from "./ActorMethod"
import Namespace from "./Namespace"
import NamespaceMethod from "./NamespaceMethod"

import $ from "jquery";
import "../_styles/api.css";

class LuaAPI extends Component {

	constructor(){
		super();
		this.state = {
			isLoaded: false,

			filtered_results: [],
			textFilter: "",

			visible_categories: {
				"Actor Classes": true,
				"Namespaces": true,
				"Singletons": false,
				"Global Functions": false,
				"Enums": false,
				"Constants": false
			}
		}

		const lua_api = this;

		// the API doesn't need to be filtered and re-filtered with each new keyup event
		// instead, wait 500ms for keyup events to cease before calling filterResults()
		// these variables are used as part of that 0.5 second timeout system
		// see: https://stackoverflow.com/a/5926782
		this.typingTimer = null
		this.doneTypingInterval = 500

		// this.all_elements = null

		// a pojo containing just the actor class names as keys
		// used for lookup purposes in get_return_value()
		this.actor_class_names = {}

		// ensure that these functions have access to "this"
		this.handleFilter = this.handleFilter.bind(this)
		this.filterResults= this.filterResults.bind(this)
		this.getReturnValue = this.getReturnValue.bind(this)

		this.get_elements_to_render = function(classes_to_render){

			return {
				"Actor Classes": classes_to_render[0].map(function(actor, i){
					const methods = actor.methods.map(function(method, j){
						return <ActorMethod actor={actor} method={method} key={actor.name + "-" + method.name + j} />
					})
					return <ActorClass actor={actor} methods={methods} key={actor.name} />
				}),

				"Namespaces": classes_to_render[1].map(function(n, i){
					const methods = n.methods.map(function(method, j){
						return <NamespaceMethod namespace={n} method={method} key={n.name + "-" + method.name + j} />
					})
					return <Namespace namespace={n} methods={methods} key={n.name} />
				}),


				"Singletons": null,
				"Global Functions": null,
				"Enums": null,
				"Constants": null
			}
		}

		// ---------------------------------------------------------------------

		const get_base = function(actors_with_base, actor_class){
			const _class = $(actors_with_base).find("Class[name='" + actor_class + "']")

			if (_class[0] && _class[0].attributes.base){
				const base = _class[0].attributes.base.textContent
				return " : <a href='#" + base + "'>" + base + "</a>"
			}
			return null
		}

		$.ajax({
			url: "./API/LuaDocumentation.xml"

		}).done(function(lua_documentation){

			$.ajax({
				url: "./API/Lua.xml"
			}).done(function(lua_dot_xml){

				const actors_with_base = $(lua_dot_xml).children()[0].children[1]

				const namespaces = Array.from($(lua_documentation).children().find("Namespaces Namespace"))
				const actor_classes = Array.from($(lua_documentation).children().find("Classes Class"))

				// actor classes, namespaces, singletons, global functions, enums, constants
				let data = [ [], [], [], [], [], [] ]

				// ---------------------------------------------------------------------
				// first, populate the actor_class_names object with the names of each actor class
				// we'll need this to check against in the next forEach loop below
				const actor_class_names = {}

				actor_classes.forEach(function(actor_class){
					actor_class_names[actor_class.attributes.name.textContent] = true
				})

				// retain the actor_class_names object as state so we can refer to it in get_return_value()
				lua_api.actor_class_names = actor_class_names

				// ---------------------------------------------------------------------
				// next, do the "heavy lifting"
				// process each actor_class...
				actor_classes.forEach(function(actor_class){

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
						return {
							name: method.attributes.name.textContent,
							return: lua_api.getReturnValue(method.attributes.return.textContent),
							arguments: method.attributes.arguments.textContent,
							desc: method.innerHTML.trim()
						}
					})

					// push a new object representing this actor_class to the overall data array
					data[0].push({
						name: actor_class.attributes.name.textContent,
						base: get_base(actors_with_base, actor_class.attributes.name.textContent),
						methods: sorted_methods
					})
				})

				// ---------------------------------------------------------------------
				// next, handle namespaces...

				namespaces.forEach(function(namespace){
					const _methods = Array.from($(namespace).find("Function"))
					const methods = _methods.map(function(method, i){
						return {
							name: method.attributes.name.textContent,
							return: lua_api.getReturnValue(method.attributes.return.textContent),
							arguments: method.attributes.arguments.textContent,
							desc: method.innerHTML.trim()
						}
					})

					data[1].push({
						name: namespace.attributes.name.textContent,
						methods: methods
					})
				})

				// cache all render-able elements now so that we don't need to constantly recompute them
				lua_api.all_elements = lua_api.get_elements_to_render(data)

				// ---------------------------------------------------------------------
				// we're out of the "heavy lifting" forEach loop; it's time to setState
				lua_api.setState({
					isLoaded: true,
					actor_classes: data[0],
					namespaces: data[1],
					singletons: null,
					global_functions: null,
					enums: null,
					constants: null
				})
			})
		})
	}

	// a helper function to determine whether the "return" type of each API method
	// should be static text or an anchor linking to elsewhere in the document
	getReturnValue(r){
		// if the return text for this method exactly matches "void" just use that
		if (r === "void"){ return r }

		// next, check to see if the return text matches any of the actor classes
		if (this.actor_class_names[r]){
			return "<a href='#" + r +"'>" + r + "</a>"
		}

		// maybe this method's return value is an Actor wrapped in curly braces
		// indicating that this method returns a table of Actors
		// (though, it could also be "float" wrapped in curly braces,
		// which we don't want to try to try to create an anchor to)
		const _r = r.match(/{(.+)}/)
		if (_r && this.actor_class_names[_r[1]]){
			return "{ <a href='#" + _r[1] +"'>" + _r[1] + "</a> }"
		}

		// otherwise, we have something like "bool" or "int"; just return it
		return r
	}

	handleFilter(e){

		const eventValue = e.target.value
		const lua_api = this

		clearTimeout(this.typingTimer)

		this.typingTimer = setTimeout(
			function() {
				lua_api.filterResults(eventValue.toUpperCase())
			},
			this.doneTypingInterval
		)
	}

	filterResults(eventValue){

		let results = [ [], [], [], [], [], [] ]

		// loop through all actor classes stored in state,
		// searching for string matches in various ways
		this.state.actor_classes.forEach(function(actor){

			// if name of this entire actor class includes the user-input string
			if (actor.name.toUpperCase().includes(eventValue)){
				// push the entire actor class and all its methods to the array of filtered results
				results[0].push(actor)
				// and continue to the next actor class
				return
			}

			// otherwise, loop through the methods available to this actor, using
			// filter() to reduce a larger array to a smaller array of filtered results
			const filtered_methods = actor.methods.filter(function(method){
				// check for case-insensitive strings matches on the method name or description
				// if either is a match, return true, which means this method passes the filter()
				// test and will be included in the pared down filtered_methods array
				return (method.name.toUpperCase().includes(eventValue) || method.desc.toUpperCase().includes(eventValue))
			})

			// if any matches were found above, filtered_methods will contain those methods
			// for this actor, so push them to the results array now so that they'll persist
			// outside of this iteration of the forEach loop
			if (filtered_methods.length > 0){
				results[0].push({
					name: actor.name,
					methods: filtered_methods
				})
			}
		})


		// loop through all namespaces stored in state,
		// searching for string matches in various ways
		this.state.namespaces.forEach(function(n){

			// if name of this entire actor class includes the user-input string
			if (n.name.toUpperCase().includes(eventValue)){
				// push the entire namespace and all its methods to the array of filtered results
				results[1].push(n)
				// and continue to the next namespace
				return
			}



			// otherwise, loop through the methods available to this namespace, using
			// filter() to reduce a larger array to a smaller array of filtered results
			const filtered_methods = n.methods.filter(function(method){
				// check for case-insensitive strings matches on the method name or description
				// if either is a match, return true, which means this method passes the filter()
				// test and will be included in the pared down filtered_methods array
				return (method.name.toUpperCase().includes(eventValue) || method.desc.toUpperCase().includes(eventValue))
			})

			// if any matches were found above, filtered_methods will contain those methods
			// for this namespace, so push them to the results array now so that they'll persist
			// outside of this iteration of the forEach loop
			if (filtered_methods.length > 0){
				results[1].push({
					name: n.name,
					methods: filtered_methods
				})
			}
		})

		// finally, use whatever results we got to set the state for filtered_results
		this.setState({
			filtered_results: results,
			textFilter: eventValue
		})
	}

	handleCategoryClick(category, e){
		var categories = {...this.state.visible_categories}
		categories[category] = !(this.state.visible_categories[category])
		this.setState({visible_categories: categories})
	}

	render() {

		if (this.state && this.state.isLoaded){

			let elements = null

			if (this.state.textFilter === ""){
				elements = this.all_elements
			} else{
				elements = this.get_elements_to_render(this.state.filtered_results)
			}

			return (
				<div className="LuaAPI">

					<p className="alert alert-info">
						This version of SM5&apos;s API is in beta, and a lot of useful information hasn&apos;t been transitioned over yet!
						<br /><br />
						The original, full API can <a href="/Lua-For-SM5/API/Lua.xml">still be accessed here</a>.
					</p>

					<h1>SM5 Lua API</h1>
					<label htmlFor="filter">Search:&nbsp;</label>
					<input type="text" id="filter" onChange={this.handleFilter} />

					<h2 className="API-Category" onClick={(e) => this.handleCategoryClick("Actor Classes", e)}>Actor Classes</h2>
					<div>{this.state.visible_categories["Actor Classes"] && elements["Actor Classes"]}</div>

					<h2 className="API-Category" onClick={(e) => this.handleCategoryClick("Namespaces", e)}>Namespaces</h2>
					<div>{this.state.visible_categories["Namespaces"] && elements["Namespaces"]}</div>

					<h2 className="API-Category" onClick={(e) => this.handleCategoryClick("Singletons", e)}>Singletons</h2>

					<h2 className="API-Category" onClick={(e) => this.handleCategoryClick("Global Functions", e)}>Global Functions</h2>

					<h2 className="API-Category" onClick={(e) => this.handleCategoryClick("Enums", e)}>Enums</h2>

					<h2 className="API-Category" onClick={(e) => this.handleCategoryClick("Constants", e)}>Constants</h2>
				</div>
			)
		} else {
			return null
		}
	}
}

export default LuaAPI;