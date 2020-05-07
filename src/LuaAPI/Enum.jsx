import React, { Component } from "react"
import Octicon from 'react-octicon'

class Enum extends Component {

	constructor(props){
		super()
		// ensure that updateHash has access to "this"
		this.updateHash = this.updateHash.bind(this)
	}

	updateHash(){
		window.location.hash = "#Enums-" + this.props.enum.name
	}

	getValuesToRender(){
		return this.props.enum.values.map(function(e, i){
			return( <tr key={"enum-"+e.name+"-"+e.name+"-"+i}><td>{e.name}</td><td>{e.value}</td></tr> )
		})
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
					<tbody>{this.getValuesToRender()}</tbody>
				</table>
			</div>
		)
	}
}

export default Enum