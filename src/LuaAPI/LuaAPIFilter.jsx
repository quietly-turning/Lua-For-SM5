import React from "react"

class LuaAPIFilter extends React.Component {

	constructor(props) {
		super(props)
		this.handleFilter = this.handleFilter.bind(this)

		// the API doc doesn't need to be filtered and re-filtered with each new keyup event
		// instead, wait 200ms for keyup events to cease before calling filterResults()
		// these variables are used as part of that 0.2 second timeout system
		// see: https://stackoverflow.com/a/5926782
		this.typingTimer = null
		this.doneTypingInterval = 200

		this.filter_icon = <img alt="" src='data:image/svg+xml;utf8,<svg fill="currentColor" alt="Search" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="24px" width="16px"><path d="M6.02945,10.20327a4.17382,4.17382,0,1,1,4.17382-4.17382A4.15609,4.15609,0,0,1,6.02945,10.20327Zm9.69195,4.2199L10.8989,9.59979A5.88021,5.88021,0,0,0,12.058,6.02856,6.00467,6.00467,0,1,0,9.59979,10.8989l4.82338,4.82338a.89729.89729,0,0,0,1.29912,0,.89749.89749,0,0,0-.00087-1.29909Z" /></svg>' />
	}

	handleFilter(e){

		const eventValue = e.target.value
		const filter_object = this

		clearTimeout(this.typingTimer)

		this.typingTimer = setTimeout(
			function() {
				filter_object.props.onFilterChange(eventValue.toUpperCase())
			},
			this.doneTypingInterval
		)
	}

	render() {
		return (
			<fieldset>
				<div className="input-group">
					<div className="input-group-prepend"><div className="input-group-text">{this.filter_icon}</div></div>
					<input type="text" id="filter" className="form-control" placeholder="type to filter..." onChange={this.handleFilter} />
				</div>
			</fieldset>
		)
  }
}

export default LuaAPIFilter