/* eslint-disable no-undef */
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProjectList from "./components/projectList/ProjectList";
import FormManager from "./components/formManager/FormManager";
import Footer from "./components/footer/Footer";

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
				<Footer />
			</div>
		</Router>
	);
}

export default App;
