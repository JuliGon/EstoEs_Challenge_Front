import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProjectList from "./components/ProjectList";
import FormManager from "./components/FormManager";

function App() {
	return (
		<Router>
			<div>
			<Routes>
				<Route exact path="/" element={<ProjectList />} />
				<Route
					path="/projects/create"
					element={<FormManager isEditMode={false} />}
				/>
				<Route
					path="/projects/:id"
					element={<FormManager isEditMode={true} />}
				/>
			</Routes>
			</div>
		</Router>
	);
}

export default App;
