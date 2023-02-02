import React, { Component } from "react"

import Header      from "./Header"
import Description from "./Description"
import SMClass     from "./SMClass"

class SectionSMClass extends Component {

	constructor(props){
		super(props)

		this.smclasses = this.props.data.map(function(cls, i){
			return <SMClass grouping={cls.grouping} smclass={cls} key={cls.name}  />
		})
	}

	render(){
		// if this section has no classes, don't render the section name or description
		if (this.smclasses.length < 1){
			return(<section/>)
		}

		return(
			<section>
				<Header name={this.props.name} smclass={{}} level={2} />

				<Description desc={this.props.desc} />

				<div>{this.smclasses}</div>
			</section>
		)
	}
}

export default SectionSMClass