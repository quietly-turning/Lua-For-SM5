import React, { Component } from "react";
import Octicon from 'react-octicon'

class ActorMethod extends Component {

	constructor(){
		super()
		// ensure that these functions have access to "this"
		this.updateHash = this.updateHash.bind(this)
	}

	updateHash(){
		window.location.hash = "#Actors-" + this.props.actor.name +  "-" + this.props.method.name
	}

	render(){
		return(
			<div id={"Actors-" + this.props.actor.name +  "-" + this.props.method.name} className="method">
				<div className="method-signature">
					<Octicon onClick={this.updateHash} name="link" />
					{this.props.method.name}
					(<code>{this.props.method.arguments}</code>)
				</div>

				<span className="method-return"><em>return: </em> <span dangerouslySetInnerHTML={{__html: this.props.method.return}} />  </span>
				<span className="method-description" dangerouslySetInnerHTML={{ __html: this.props.method.desc }} />
			</div>
		)
	}
}

export default ActorMethod;