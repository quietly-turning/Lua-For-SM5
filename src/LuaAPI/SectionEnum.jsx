import React, { Component } from "react"
import Header      from "./Header"
import Description from "./Description"
import SMEnum      from "./SMEnum"

class SectionEnum extends Component {

	constructor(props){
		super(props)

		this.enums = this.props.data.map(function(e, i){
			return <SMEnum name={e.name} desc={e.desc} values={e.values} key={e.name}  />
		})
	}

	render(){
		return(
			<section>
				<Header name={this.props.name} smclass={{}} level={2} />
				<Description desc={this.props.desc} />
				<div>{this.enums}</div>
			</section>
		)
	}
}

export default SectionEnum