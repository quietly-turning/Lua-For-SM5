import React, { Component } from "react";

class ActorClass extends Component {
	render(){
		return(
			<div id={this.props.actor.name} className="actor-class">
				<h3>
					{this.props.actor.name}
					<span className="base" dangerouslySetInnerHTML={{ __html: this.props.actor.base }}  />
				</h3>
				{this.props.methods}
			</div>
		)
	}
}

export default ActorClass;