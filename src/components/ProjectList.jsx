/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import {
	getProjects,
	deleteProject,
	updateProject,
} from "../utils/projectControllers";
import { getAssignments } from "../utils/assignmentControllers";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BsPencil } from "react-icons/bs";
import { BsTrash3 } from "react-icons/bs";

export default function ProjectList() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [projects, setProjects] = useState([]);
	const [assignments, setAssignments] = useState([]);
	const [openProjectMenu, setOpenProjectMenu] = useState(null); // Nuevo estado para controlar qué menú se abre

	useEffect(() => {
		const controller = new AbortController();
		const signal = controller.signal;

		const fetchProjects = async () => {
			try {
				setLoading(true);
				setError(null);

				const [projectResponse, assignmentResponse] = await Promise.all([
					getProjects(signal),
					getAssignments(),
				]);

				// Crea un objeto de asignaciones con ID como clave
				const assignmentMap = {};
				assignmentResponse.forEach((assignment) => {
					assignmentMap[assignment.id] = assignment;
				});

				setAssignments(assignmentMap);

				// Asocia las asignaciones a los proyectos
				const projectsWithAssignments = projectResponse.map((project) => ({
					...project,
					assignment: assignmentMap[project.assignedTo],
				}));

				setProjects(projectsWithAssignments);
			} catch (error) {
				if (!signal.aborted) {
					setError(error);
				}
			} finally {
				setLoading(false);
			}
		};

		fetchProjects();

		return () => {
			controller.abort();
		};
	}, []);

	const formatCreatedAt = (createdAt) => {
		const date = new Date(createdAt);
		const options = {
			year: "numeric",
			month: "numeric",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
		};
		return date.toLocaleDateString("es-ES", options);
	};

	const handleEdit = async (project) => {
		try {
			const updatedProject = await updateProject(project.id, {
				name: "Nuevo nombre del proyecto",
			});

			setProjects((prevProjects) =>
				prevProjects.map((p) =>
					p.id === updatedProject.id ? updatedProject : p
				)
			);

			// Cierra el menú después de editar.
			closeMenu();
		} catch (error) {
			console.error("Error al editar el proyecto:", error);
		}
	};

	const handleDelete = async (project) => {
		try {
			await deleteProject(project.id);

			setProjects((prevProjects) =>
				prevProjects.filter((p) => p.id !== project.id)
			);

			// Cierra el menú después de eliminar.
			closeMenu();
		} catch (error) {
			console.error("Error al eliminar el proyecto:", error);
		}
	};

	// Función para abrir el menú desplegable
	const openMenu = (project) => {
		setOpenProjectMenu(project);
	};

	// Función para cerrar el menú desplegable
	const closeMenu = () => {
		setOpenProjectMenu(null);
	};

	// Ref para el menú desplegable
	const menuRef = useRef(null);

	// Función para calcular la posición del menú desplegable
	const calculateMenuPosition = (project) => {
		if (menuRef.current) {
			const elementRect = menuRef.current.getBoundingClientRect();
			const windowHeight = window.innerHeight;

			const topPosition =
				elementRect.bottom + window.scrollY + elementRect.height;

			if (topPosition + elementRect.height > windowHeight) {
				// Si el menú desplegable se desborda hacia abajo, muéstralo hacia arriba
				return {
					top: "auto",
					bottom: elementRect.height + "px",
				};
			}
		}
		// Por defecto, muestra el menú desplegable hacia abajo
		return {
			top: "100%",
			bottom: "auto",
		};
	};

	return (
		<div className="container-fluid">
			<div className="fw-bold" style={{ marginLeft: "24px" }}>
				My Projects
			</div>
			{loading && <p>Loading...</p>}
			{error && <p>Error: {error.message}</p>}
			{!loading && !error && (
				<ul className="list-group list-group-flush">
					{projects.map((project) => (
						<li
							key={project.id}
							className="list-group-item align-items-start position-relative"
							aria-current="true"
						>
							<div>
								<div className="ms-2 me-auto">
									<div className="fw-bold">{project.name}</div>
									<small>
										Creation date: {formatCreatedAt(project.createdAt)}
									</small>
								</div>
								<div>
									{project.assignment && (
										<img
											src={project.assignment.image}
											alt="Avatar"
											className="rounded-circle me-3"
											width="25"
											height="25"
											style={{ marginLeft: "7.5px" }}
										/>
									)}
									<span className="">
										{project.assignment
											? project.assignment.name
											: "Unassigned"}
									</span>
								</div>
								<div
									className="position-absolute top-0 end-0 mt-2 me-2"
									style={{ zIndex: 1 }}
									ref={menuRef}
									onClick={(e) => e.stopPropagation()}
								>
									<button
										className="btn btn-link btn-sm"
										onClick={(e) => {
											e.stopPropagation();
											openMenu(project);
										}}
									>
										<BsThreeDotsVertical style={{ color: "black" }} />
									</button>
									{openProjectMenu === project && (
										<div
											className="position-absolute"
											style={{
												...calculateMenuPosition(project),
												backgroundColor: "white",
                        width: "100px",
												boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.15)",
												zIndex: 5,
                        marginLeft: "-50px",
											}}
										>
											<ul className="list-group list-group-flush">
												<li
													className="list-group-item d-flex align-items-center"
													onClick={() => handleEdit(project)}
												>
													<BsPencil style={{ marginRight: "8px" }} />
													<span>Edit</span>
												</li>
												<li
													className="list-group-item d-flex align-items-center"
													onClick={() => handleDelete(project)}
												>
													<BsTrash3 style={{ marginRight: "8px" }} />
													<span>Delete</span>
												</li>
											</ul>
										</div>
									)}
								</div>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
