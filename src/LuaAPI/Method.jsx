import { Component } from "react"
import Octicon, {Link, LogoGithub} from '@primer/octicons-react'
import { supportedAPIs } from "./modules/SupportedAPIs.js"

class Method extends Component {

	constructor(props){

		super(props)

		// class methods will have an sm_class prop, but GlobalFunctions will not
		const sm_class = (this.props.sm_class !== undefined) ?  ("-" + this.props.sm_class) : ""
		const _name    = "-" + this.props.method.name
		this.id = this.props.grouping + sm_class + _name

		// ensure that updateHash has access to "this"
		this.updateHash = this.updateHash.bind(this)

		if (this.props.method.url !== undefined){

			// FIXME: we shouldn't need to derive the project name and version
			//        both should be passed in as props
			let i = 0
			for (const supportedAPI of supportedAPIs){
				if (supportedAPI.name == this.props.selectedAPI.engineName){
					break
				} else {
					i = i + 1
				}
			}

			let j = 0
			for (const version of supportedAPIs[i].versions){
				if (version.name == this.props.selectedAPI.versionName){
					break
				} else {
					j = j + 1
				}
			}

			const github_user    = supportedAPIs[i].github.user
			const github_project = supportedAPIs[i].github.project
			const hash = supportedAPIs[i].versions[j].githash

			const base = `https://github.com/${github_user}/${github_project}/tree/`
			const url  = base + hash + this.props.method.url

			this.github_anchor = <a className="logo-github" href={url} target="_blank" rel="noopener noreferrer"><Octicon icon={LogoGithub} /></a>

		} else {
			this.github_anchor = ""
		}
	}

	updateHash(){
		window.location.hash = "#" + this.id
	}

	render(){
		return(
			<div id={this.id} className="method">
				<div className="method-signature">
					<span className="octicon-link" onClick={this.updateHash}><Octicon icon={Link} /></span>
					<span>
						{this.props.method.name}
						(<code>{this.props.method.arguments}</code>)
					</span>
					{this.github_anchor}
				</div>

				<span className="method-return"><em>return: </em> <span dangerouslySetInnerHTML={{__html: this.props.method.return}} />  </span>
				<span className="description description" dangerouslySetInnerHTML={{ __html: this.props.method.desc }} />
			</div>
		)
	}
}

export default Method