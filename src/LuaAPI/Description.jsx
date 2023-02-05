import { Component } from "react"

class Description extends Component {

	render(){
		return(
			<div className="description" dangerouslySetInnerHTML={{__html: this.props.desc}} />
		)
	}
}

export default Description