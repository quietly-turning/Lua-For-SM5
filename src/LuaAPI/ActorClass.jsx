import React, { Component } from "react"
import Octicon from 'react-octicon'

import ActorMethod from "./ActorMethod"

class ActorClass extends Component {

	constructor(props){
		super()
		// ensure that updateHash has access to "this"
		this.updateHash = this.updateHash.bind(this)

		this.methods = props.actor.methods.map(function(method, j){
			return <ActorMethod actor_name={props.actor.name} method={method} key={props.actor.name + "-" + method.name + j} />
		})
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

				<span className="actorclass-description" dangerouslySetInnerHTML={{__html: this.props.actor.desc}} />

				{this.methods}
			</div>
		)
	}
}

export default ActorClass