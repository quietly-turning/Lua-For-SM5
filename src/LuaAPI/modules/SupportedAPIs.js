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
				name: "(beta)",
				githash: "beta",
			},
			{
				name: "v0.7.0",
				githash: "28b7659a0999fea52b6fc475673a52157d903454",
			},
			{
				name: "v0.6.0",
				githash: "222fd619e77b661839a7d0428e79e9335ac22bcb",
			},
			{
				name: "v0.5.1",
				githash: "e2a48eb7267103b28436760a839819a2ec006e7d",
			},
		],
	},
]

const supportedAPIsMap = {}
for (const supportedAPI of supportedAPIs){
	for (const version of supportedAPI.versions){
		supportedAPIsMap[`${supportedAPI.name}-${version.name}`] = [supportedAPI, version]
	}
}

// create a default url for API retrieval
// the user can change this later using a <select> element
const url_base    = "https://raw.githubusercontent.com/"
const project     = `${supportedAPIs[0].github.user}/${supportedAPIs[0].github.project}`
const git_hash    = supportedAPIs[0].versions[0].githash
const default_key = supportedAPIs[0].name + "-" + supportedAPIs[0].versions[0].name
const default_url = `${url_base}${project}/${git_hash}/Docs/Luadoc/`

export { supportedAPIs, supportedAPIsMap, url_base, default_key, default_url }