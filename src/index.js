import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min"

import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router"
import App from "./App"


const root = ReactDOM.createRoot(document.body);
root.render(
	<BrowserRouter basename={process.env.PUBLIC_URL}>
		<App />
	</BrowserRouter>
);