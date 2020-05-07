import React, { Component } from "react";
import Octicon from 'react-octicon'

class Namespace extends Component {

	constructor(){
		super()
		// ensure that these functions have access to "this"
		this.updateHash = this.updateHash.bind(this)
	}

	updateHash(){
		window.location.hash = "#Namespaces-" + this.props.namespace.name
	}

	render(){
		return(
			<div id={"Namespaces-" + this.props.namespace.name} className="actor-class">
				<h3>
					<Octicon onClick={this.updateHash} name="link" />
					{this.props.namespace.name}
				</h3>
				<hr />

				<span className="namespace-description" dangerouslySetInnerHTML={{__html: this.props.namespace.desc}} />

				{this.props.methods}
			</div>
		)
	}
}

export default Namespace;