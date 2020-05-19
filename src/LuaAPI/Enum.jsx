import React, { Component } from "react"
import Octicon, {getIconByName} from '@primer/octicons-react'

class Enum extends Component {

	constructor(props){
		super(props)
		// ensure that each of these functions has access to "this"
		this.updateHash = this.updateHash.bind(this)
		this.getAll     = this.getAll.bind(this)
		this.filter     = this.filter.bind(this)

		this.allValues = this.getAll()
		this.values    = this.allValues

		this.textfilter = this.props.text_filter
	}

	updateHash(){
		window.location.hash = "#Enums-" + this.props.enum.name
	}

	getAll(){
		return this.props.enum.values.map(function(e, i){
			return( <tr key={"enum-"+e.name+"-"+e.name+"-"+i}><td>{e.name}</td><td>{e.value}</td></tr> )
		})
	}

	handleTFChange(){
		const showAllValues = this.props.enum.name.toUpperCase().includes(this.props.text_filter)
		this.values = showAllValues ? this.allValues : this.filter()
		this.textfilter = this.props.text_filter
	}

	filter(){
		const text_filter = this.props.text_filter

		// loop through the values available to this enum, using
		// filter() to reduce a larger array to a smaller array of filtered results
		const filtered_values = this.props.enum.values.filter(function(value){
			// check for case-insensitive strings matches on the value name
			// if it's match, return true, which means this value passes the filter()
			// test and will be included in the pared down filtered_values array
			return value.name.toUpperCase().includes(text_filter)
		})

		return filtered_values.map(function(e, i){
			return( <tr key={"enum-"+e.name+"-"+e.name+"-"+i}><td>{e.name}</td><td>{e.value}</td></tr> )
		})
	}

	render(){
		if (this.props.text_filter !== this.textfilter){ this.handleTFChange() }
		if (this.values.length < 1){ return null }

		return(
			<div id={"Enums-" + this.props.enum.name} className="enum">

				<h3>
					<span className="octicon-link" onClick={this.updateHash}><Octicon size="medium" icon={getIconByName("link")} /></span>
					{this.props.enum.name}
				</h3>

				<span className="enum-description" dangerouslySetInnerHTML={{__html: this.props.enum.desc}} />

				<table className="table table-hover table-sm table-bordered">
					<thead className="table-primary"><tr><th><strong>{this.props.enum.name}</strong></th><th style={{width:15+"%"}}>Value</th></tr></thead>
					<tbody>{this.values}</tbody>
				</table>
			</div>
		)
	}
}

export default Enum