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
			<p id={"Actors-" + this.props.actor.name +  "-" + this.props.method.name} className="method">
				<span onClick={this.updateHash} className="method-signature">
				<Octicon name="link" />
				{this.props.method.name}
				(</span><code>{this.props.method.arguments}</code><span className="method-signature">)
				</span>

				<span className="method-return"><em>return: </em> <span dangerouslySetInnerHTML={{__html: this.props.method.return}} />  </span>
				<span className="method-description" dangerouslySetInnerHTML={{ __html: this.props.method.desc }} />
			</p>
		)
	}
}

export default ActorMethod;