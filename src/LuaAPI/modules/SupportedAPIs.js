// ------- supported versions of the API to let users view
const supportedAPIs = [
	{
		name: "StepMania",
		github: {
			user:    "stepmania",
			project: "stepmania",
		},
		versions: [
			{
				name: "5.1 (dev)",
				githash: "HEAD",
			},
			{
				name: "5.1 beta2",
				githash: "f1ebe8d9d82b8272ddc2c63967780db28430e370",
			},
			{
				name: "5.0.12",
				githash: "45e0787a7457c1b9071522463aa902d59ae3a2ee",
			},
		],
	},
	{
		name: "ITGMania",
		github: {
			user:    "itgmania",
			project: "itgmania",
		},
		versions: [
			{
				name: "(dev)",
				githash: "HEAD",
			},
			{
				name: "v0.5.1",
				githash: "e2a48eb7267103b28436760a839819a2ec006e7d",
			},
		],
	},
]

// create a default url for API retrieval
// the user can change this later using a <select> element
const url_base    = "https://raw.githubusercontent.com/"
const project     = `${supportedAPIs[0].github.user}/${supportedAPIs[0].github.project}`
const git_hash    = supportedAPIs[0].versions[0].githash
const default_url = `${url_base}${project}/${git_hash}/Docs/Luadoc/`

export { supportedAPIs, url_base, default_url }