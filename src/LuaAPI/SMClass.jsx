import React, { Component } from "react"

import Header      from "./Header"
import Description from "./Description"
import Method      from "./Method"

class SMClass extends Component {

	constructor(props){
		super(props)

		const _name    = this.props.smclass.name
		const grouping = this.props.grouping

		this.methods = this.props.smclass.methods.map(function(method, j){
			return <Method grouping={grouping} sm_class={_name} method={method} key={_name + "-" + method.name + j} />
		})
	}

	render(){
		return(
			<div id={this.props.grouping + "-" + this.props.smclass.name} className="section-child">

				<Header grouping={this.props.grouping} name={this.props.smclass.name} smclass={this.props.smclass} level={3} />

				{this.props.smclass.desc != "" && <Description desc={this.props.smclass.desc} />}
				{this.methods}
			</div>
		)
	}
}

export default SMClass