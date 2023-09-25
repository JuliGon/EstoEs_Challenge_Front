/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { updateProject, getProjects } from "../../utils/projectControllers";
import { useParams } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export default function EditProjectForm() {
	const { id } = useParams();
	const projectId = parseInt(id, 10);
	const [projects, setProjects] = useState([]);
	const [formData, setFormData] = useState({
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
				const projectsData = await getProjects();
				setProjects(projectsData);
				console.log(projectsData);
			} catch (error) {
				console.error("Error loading data", error);
			}
		}

		fetchData();
	}, []);

	useEffect(() => {
		// Verifica si el proyecto con projectId existe en la lista de proyectos.
		console.log(projectId);
		const project = projects.find((project) => project.id === projectId);

		if (!project) {
			console.error("Project not found");
			return;
		}

		// Actualiza el estado de formData cuando se encuentra el proyecto.
		setFormData({
			name: project.name || "",
			description: project.description || "",
			projectManager: project.projectManager || "",
			assignedTo: project.assignedTo || "",
			status: project.status || "",
		});
	}, [projectId, projects]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (
			!formData.name ||
			!formData.description ||
			!formData.projectManager ||
			!formData.assignedTo ||
			!formData.status
		) {
			alert("All fields are required");
			return;
		}

		try {
			await updateProject(projectId, formData);
			window.alert("Project updated successfully");
			navigate("/");
		} catch (error) {
			console.error("Something went wrong:", error);
		}
	};

	return (
		<>
			<nav
				className="navbar fixed-top"
				style={{ zIndex: 1, backgroundColor: "#ffffff" }}
			>
				<div className="container-fluid">
					<form>
						<button className="btn" type="button">
							<a href="/" style={{ textDecoration: "none", color: "#1d1d1d" }}>
								<BsArrowLeft style={{ marginRight: "8px" }} />
								Back
							</a>
						</button>
					</form>
					<a className="navbar-brand">Edit project</a>
				</div>
			</nav>
			<div
				className="container-fluid"
				style={{ marginTop: "65px" }}
			>
				<form onSubmit={handleSubmit}>
					<div className="mb-3">
						<label htmlFor="name" className="form-label">
							Name
						</label>
						<input
							type="text"
							className="form-control"
							id="name"
							name="name"
							value={formData.name}
							onChange={handleInputChange}
							required
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="description" className="form-label">
							Description
						</label>
						<textarea
							type="text"
							className="form-control"
							id="description"
							name="description"
							value={formData.description}
							onChange={handleInputChange}
							required
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="projectManager" className="form-label">
							Project Manager
						</label>
						<input
							type="text"
							className="form-control"
							id="projectManager"
							name="projectManager"
							value={formData.projectManager}
							onChange={handleInputChange}
							required
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="assignedTo" className="form-label">
							Assigned to
						</label>
						<input
							type="text"
							className="form-control"
							id="assignedTo"
							name="assignedTo"
							value={formData.assignedTo}
							onChange={handleInputChange}
							required
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="status" className="form-label">
							Status
						</label>
						<input
							type="text"
							className="form-control"
							id="status"
							name="status"
							value={formData.status}
							onChange={handleInputChange}
							required
						/>
					</div>
					<button type="submit" className="btn btn-primary">
						Save changes
					</button>
				</form>
			</div>
		</>
	);
}
