import React, { Component } from "react"
import Octicon from 'react-octicon'

import Method from "./Method"

class ActorClass extends Component {

	constructor(props){
		super()
		// ensure that updateHash has access to "this"
		this.updateHash = this.updateHash.bind(this)
	}

	updateHash(){
		window.location.hash = "#Actors-" + this.props.actor.name
	}

	getMethodsToRender(){
		const actor_name = this.props.actor.name
		return this.props.actor.methods.map(function(method, j){
			return <Method sm_class_grouping="Actors" sm_class={actor_name} method={method} key={actor_name + "-" + method.name + j} />
		})
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

				{this.getMethodsToRender()}
			</div>
		)
	}
}

export default ActorClass