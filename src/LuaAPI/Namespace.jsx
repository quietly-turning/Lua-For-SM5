import React, { Component } from "react";
import Octicon from 'react-octicon'

import NamespaceMethod from "./NamespaceMethod"

class Namespace extends Component {

	constructor(props){
		super()
		// ensure that updateHash has access to "this"
		this.updateHash = this.updateHash.bind(this)
	}

	updateHash(){
		window.location.hash = "#Namespaces-" + this.props.namespace.name
	}

	getMethodsToRender(){
		const namespace_name = this.props.namespace.name
		return this.props.namespace.methods.map(function(method, j){
			return <NamespaceMethod namespace_name={namespace_name} method={method} key={namespace_name + "-" + method.name + j} />
		})
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

				{this.getMethodsToRender()}
			</div>
		)
	}
}

export default Namespace