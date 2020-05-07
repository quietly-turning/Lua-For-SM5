import React, { Component } from "react";
import Octicon from 'react-octicon'

import NamespaceMethod from "./NamespaceMethod"

class Namespace extends Component {

	constructor(props){
		super()
		// ensure that updateHash has access to "this"
		this.updateHash = this.updateHash.bind(this)

		this.methods = props.namespace.methods.map(function(method, j){
			return <NamespaceMethod namespace_name={props.namespace.name} method={method} key={props.namespace.name + "-" + method.name + j} />
		})
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

				{this.methods}
			</div>
		)
	}
}

export default Namespace