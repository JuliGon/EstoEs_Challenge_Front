import { useEffect, useState } from "react";
import { createProject } from "../../utils/projectControllers";
import { getPMs } from "../../utils/pmControllers";
import { getAssignments } from "../../utils/assignmentControllers";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export default function CreateProjectForm() {
	const [projectManagers, setProjectManagers] = useState([]);
	const [assignments, setAssignments] = useState([]);
	const [projectData, setProjectData] = useState({
		name: "",
		description: "",
		projectManager: "",
		assignedTo: "",
		status: "",
	});

	const navigate = useNavigate();

	useEffect(() => {
		async function fetchData() {
			try {
				const pmResponse = await getPMs();
				const assignmentResponse = await getAssignments();

				setProjectManagers(pmResponse);
				setAssignments(assignmentResponse);
			} catch (error) {
				console.error("Error al cargar datos", error);
			}
		}

		fetchData();
	}, []);

	const handleCreateProject = (e) => {
		e.preventDefault();
		if (
			!projectData.name ||
			!projectData.description ||
			!projectData.projectManager ||
			!projectData.assignedTo ||
			!projectData.status
		) {
			alert("All fields are required");
			return;
		}

		try {
			createProject(projectData);
			setProjectData({
				name: "",
				description: "",
				projectManager: "",
				assignedTo: "",
				status: "",
			});
			window.alert("Project created successfully")
			navigate("/");
		} catch (error) {
			console.error("Something went wrong", error);
		}
	};

	return (
		<>
			<nav
				className="navbar fixed-top"
				style={{ zIndex: 1, backgroundColor: "#ffffff" }}
			>
				<div className="container-fluid">
					<form className="d-flex">
						<button className="btn" type="button">
							<a href="/" style={{ textDecoration: "none", color: "#1d1d1d" }}>
								<BsArrowLeft style={{ marginRight: "8px" }} />
								Back
							</a>
						</button>
					</form>
					<a className="navbar-brand">Add project</a>
				</div>
			</nav>
			<div
				className="container-fluid"
				style={{ marginTop: "65px" }}
			>
				<form onSubmit={handleCreateProject}>
					<div className="mb-3">
						<label htmlFor="projectName" className="form-label">
							Name
						</label>
						<input
							type="text"
							className="form-control"
							id="projectName"
							value={projectData.name}
							onChange={(e) =>
								setProjectData({ ...projectData, name: e.target.value })
							}
							required
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="projectDescription" className="form-label">
							Description
						</label>
						<textarea
							className="form-control"
							id="projectDescription"
							rows="3"
							value={projectData.description}
							onChange={(e) =>
								setProjectData({ ...projectData, description: e.target.value })
							}
							required
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="projectPM" className="form-label">
							Project Manager
						</label>
						<select
							className="form-select"
							id="projectPM"
							value={projectData.projectManager}
							onChange={(e) =>
								setProjectData({
									...projectData,
									projectManager: e.target.value,
								})
							}
							required
						>
							<option value="">Select a person</option>
							{projectManagers?.map((e) => (
								<option key={e.id} value={e.id}>
									{e.name}
								</option>
							))}
						</select>
					</div>
					<div className="mb-3">
						<label htmlFor="projectAssignment" className="form-label">
							Assigned to
						</label>
						<select
							className="form-select"
							id="projectAssignment"
							value={projectData.assignedTo}
							onChange={(e) =>
								setProjectData({ ...projectData, assignedTo: e.target.value })
							}
							required
						>
							<option value="">Select a person</option>
							{assignments?.map((e) => (
								<option key={e.id} value={e.id}>
									{e.name}
								</option>
							))}
						</select>
					</div>
					<div className="mb-3">
						<label htmlFor="projectStatus" className="form-label">
							Status
						</label>
						<select
							className="form-select"
							id="projectStatus"
							value={projectData.status}
							onChange={(e) =>
								setProjectData({ ...projectData, status: e.target.value })
							}
							required
						>
							<option value="">Select a status</option>
							<option value="Enabled">Enabled</option>
							<option value="Disabled">Disabled</option>
						</select>
					</div>
					<button type="submit" className="btn btn-danger">
						Create project
					</button>
				</form>
			</div>
		</>
	);
}
