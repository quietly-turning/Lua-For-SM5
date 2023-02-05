// ------- supported versions of the API to let users view
export const supportedAPIs = [
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