import React, { Component } from "react"
import Header      from "./Header"
import Description from "./Description"

class SectionConstants extends Component {

	constructor(props){
		super(props)
		this.constants = this.props.data.map(function(c, i){
			return(
				<tr key={"constant-"+c.name}>
					<td>{c.name}</td>
					<td>{c.value}</td>
				</tr>
			)
		})
	}

	render(){
		return(
			<section>
				<Header name={this.props.name} smclass={{}} level={2} />

				<Description desc={this.props.desc} />

				<table className="table table-hover table-sm table-bordered">
					<thead className="table-primary"><tr><th>Lua Variable</th><th>Value</th></tr></thead>
					<tbody>{this.constants}</tbody>
				</table>
			</section>
		)
	}
}

export default SectionConstants