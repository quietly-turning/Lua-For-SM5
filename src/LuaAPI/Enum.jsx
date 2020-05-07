import React, { Component } from "react"
import Octicon from 'react-octicon'

class Enum extends Component {

	constructor(){
		super()
		// ensure that these functions have access to "this"
		this.updateHash = this.updateHash.bind(this)
	}

	updateHash(){
		window.location.hash = "#Enums-" + this.props.enum.name
	}

	render(){
		return(
			<div id={"Enums-" + this.props.enum.name} className="enum">

				<h3>
					<Octicon onClick={this.updateHash} name="link" />
					{this.props.enum.name}
				</h3>

				<table className="table table-hover table-sm table-bordered">
					<thead className="table-primary"><tr><th><strong>{this.props.enum.name}</strong></th><th style={{width:15+"%"}}>Value</th></tr></thead>
					<tbody>{this.props.values}</tbody>
				</table>
			</div>
		)
	}
}

export default Enum