import { Component } from "react"
import Octicon, { Link } from '@primer/octicons-react'

class Header extends Component {

	constructor(props){
		super(props)

		const grouping = this.props.grouping || ""
		const dash = this.props.level > 2 ? "-" : ""
		const _name = this.props.name || ""
		this.id = grouping + dash + _name

		// ensure that updateHash() has access to "this"
		this.updateHash = this.updateHash.bind(this)
	}

	updateHash(){
		window.location.hash = `#${this.id}`
	}

	generateBase(base){
		if (base === undefined){ return }
		return ` : <a title="${this.props.name} inherits from ${base.name}" href="#${base.grouping}-${base.name}"> ${base.name} </a>`
	}

	render(){
		const HeaderTag = `h${this.props.level}`
		let clsName = "API-Category-Header"
		if (HeaderTag==="h3"
		//  || HeaderTag==="h2" && this.props.name==="GlobalFunctions"
		)
		{
			clsName = clsName + " sticky"
		}

		return(
			<HeaderTag id={this.props.name} className={clsName}>
				<span className="octicon-link" onClick={() => this.updateHash()}>
					<Octicon size="medium" icon={Link} />
				</span>

				{this.props.name}
				{this.props.smclass.base && <span className="base" dangerouslySetInnerHTML={{ __html: this.generateBase(this.props.smclass.base) }}  />}
				<hr />
			</HeaderTag>
		)
	}
}

export default Header