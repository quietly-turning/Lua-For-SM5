import React, { Component } from "react";

class Namespace extends Component {
	render(){
		return(
			<div id={this.props.namespace.name} className="actor-class">
				<h3>{this.props.namespace.name}</h3>
				{this.props.methods}
			</div>
		)
	}
}

export default Namespace;