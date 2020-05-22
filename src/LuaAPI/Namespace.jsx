import React, { Component } from "react";
import Octicon, {getIconByName} from '@primer/octicons-react'
import $ from "jquery"

import Method from "./Method"

class Namespace extends Component {

	constructor(props){
		super(props)
		// ensure that each of these functions has access to "this"
		this.updateHash = this.updateHash.bind(this)
		this.getAll     = this.getAll.bind(this)
		this.filter     = this.filter.bind(this)

		this.allMethods = this.getAll()
		this.methods    = this.allMethods

		this.textfilter = this.props.text_filter
	}

	updateHash(){
		window.location.hash = "#Namespaces-" + this.props.namespace.name
	}

	getAll(){
		const namespace_name = this.props.namespace.name
		return this.props.namespace.methods.map(function(method, j){
			return <Method sm_class_grouping="Namespaces" sm_class={namespace_name} method={method} key={namespace_name + "-" + method.name + j} />
		})
	}

	handleTFChange(){
		const showAllMethods = this.props.namespace.name.toUpperCase().includes(this.props.text_filter)
		this.methods = showAllMethods ? this.allMethods : this.filter()
		this.textfilter = this.props.text_filter
	}

	filter(){
		const namespace_name  = this.props.namespace.name
		const text_filter     = this.props.text_filter

		// loop through the methods available to this actor, using
		// filter() to reduce a larger array to a smaller array of filtered results
		const filtered_methods = this.props.namespace.methods.filter(function(method){
			// check for case-insensitive strings matches on the method name or description
			// if either is a match, return true, which means this method passes the filter()
			// test and will be included in the pared down filtered_methods array
			return (method.name.toUpperCase().includes(text_filter) || (  ($("<div>").html(method.desc).text() ).toUpperCase().includes(text_filter)))
		})

		return filtered_methods.map(function(method, j){
			return <Method sm_class_grouping="Namespaces" sm_class={namespace_name} method={method} key={namespace_name + "-" + method.name + j} />
		})
	}

	render(){
		if (this.props.text_filter !== this.textfilter){ this.handleTFChange() }
		if (this.props.text_filter !== "" && this.methods.length < 1){ return null }

		return(
			<div id={"Namespaces-" + this.props.namespace.name} className="actor-class">
				<h3>
					<span className="octicon-link" onClick={this.updateHash}><Octicon size="medium" icon={getIconByName("link")} /></span>
					{this.props.namespace.name}
				</h3>
				<hr />

				<span className="namespace-description" dangerouslySetInnerHTML={{__html: this.props.namespace.desc}} />

				{this.methods}
			</div>
		)
	}
}

export default Namespace