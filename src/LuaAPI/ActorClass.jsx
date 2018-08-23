import React, { Component } from "react";
import Octicon from 'react-octicon'

class ActorClass extends Component {

	constructor(){
		super()
		// ensure that these functions have access to "this"
		this.updateHash = this.updateHash.bind(this)
	}

	updateHash(){
		window.location.hash = "#Actors-" + this.props.actor.name
	}

	render(){
		return(
			<div id={"Actors-" + this.props.actor.name} className="actor-class">
				<h3>
					<Octicon onClick={this.updateHash} name="link" />
					{this.props.actor.name}
					<span className="base" dangerouslySetInnerHTML={{ __html: this.props.actor.base }}  />
				</h3>
				<hr />

				{this.props.methods}
			</div>
		)
	}
}

export default ActorClass;