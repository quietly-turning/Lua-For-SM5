import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min"

import ReactDOM          from "react-dom/client"
import { BrowserRouter } from "react-router"
import App from "./App"


const root = ReactDOM.createRoot(document.body);
root.render(
	<BrowserRouter basename={'/Lua-For-SM5/'}>
		<App />
	</BrowserRouter>
);
