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
for (const engine of supportedAPIs){
  const engine_versions = {}
  for (const version of engine.versions){
    const version_info ={
      githash:        version.githash,
      github_user:    engine.github.user,
      github_project: engine.github.project,
    }
    engine_versions[version.name] = version_info
  }
  supportedAPIsMap[engine.name] = engine_versions
}

// create a default url for API retrieval
// the user can change this later using a <select> element
const url_base        = "https://raw.githubusercontent.com/"

// export these variables for other files to use
const default_engineString = supportedAPIs[0].name
const default_versionString= supportedAPIs[0].versions[0].name

// helper function to build a url string that can be used to fetch an API doc from GitHub
// supply default values for params in case null gets passed in
const getAPIdocURL = (_engineStr=default_engineString, _versionStr=default_versionString) => {

  // basic validation in case user types non-existent engines/versions in the url
  const engineStr = supportedAPIsMap[_engineStr] ? _engineStr : default_engineString
  const versionStr= supportedAPIsMap[engineStr][_versionStr] ? _versionStr : default_versionString

  const version_info = supportedAPIsMap[engineStr][versionStr]

	return `${url_base}${version_info.github_user}/${version_info.github_project}/${version_info.githash}/Docs/Luadoc/`
}

const default_url = getAPIdocURL(default_engineString, default_versionString)

export {
  supportedAPIs, supportedAPIsMap,
  default_engineString, default_versionString, default_url,
  getAPIdocURL
}