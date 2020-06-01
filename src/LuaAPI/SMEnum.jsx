import React, { Component } from "react"
import Header      from "./Header"
import Description from "./Description"

class Enum extends Component {

	constructor(props){
		super(props)
		// ensure that each of these functions has access to "this"
		this.updateHash = this.updateHash.bind(this)

		this.values = this.props.values.map(function(e, i){
			return( <tr key={"enum-"+e.name+"-"+i}><td>{e.name}</td><td>{e.value}</td></tr> )
		})
	}

	updateHash(){
		window.location.hash = "#Enums-" + this.props.name
	}

	render(){
		return(
			<div id={"Enums-" + this.props.name} className="section-child">

				<Header name={this.props.name} smclass={{}} level={3} />

				<Description desc={this.props.desc} />

				<table className="table table-hover table-sm table-bordered">
					<thead className="table-primary"><tr><th><strong>{this.props.name}</strong></th><th style={{width:15+"%"}}>Value</th></tr></thead>
					<tbody>{this.values}</tbody>
				</table>
			</div>
		)
	}
}

export default Enum