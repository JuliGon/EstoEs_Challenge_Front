/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import {
	getProjects,
	deleteProject,
	updateProject,
} from "../../services/projectControllers";
import { Link, useNavigate } from "react-router-dom";
import { getAssignments } from "../../services/assignmentControllers";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BsPencil } from "react-icons/bs";
import { BsTrash3 } from "react-icons/bs";
import ReactPaginate from "react-paginate";
import Logo from "../../assets/Logo.png";
import "./ProjectList.css";

export default function ProjectList() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [projects, setProjects] = useState([]);
	const [assignments, setAssignments] = useState([]);
	const [openProjectMenu, setOpenProjectMenu] = useState(null);
	const [searchText, setSearchText] = useState("");
	const navigate = useNavigate();

	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [projectToDelete, setProjectToDelete] = useState(null);

	const [currentPage, setCurrentPage] = useState(0);
	const projectsPerPage = 5;

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

	// Función para formatear la fecha de creación
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

	// Manejador para editar un proyecto
	const handleEdit = async (project, formData) => {
		try {
			const updatedProject = { ...project, ...formData };
			const response = await updateProject(project.id, updatedProject);

			if (response.success) {
				setProjects((prevProjects) =>
					prevProjects.map((p) => (p.id === project.id ? updatedProject : p))
				);

				closeMenu();

				navigate(`/projects/${project.id}`);
			} else {
				console.error("Something went wrong:", response.error);
			}
		} catch (error) {
			console.error("Something went wrong:", error);
		}
	};

	// Manejador para eliminar un proyecto
	const handleDelete = async (project) => {
		try {
			await deleteProject(project.id);

			setProjects((prevProjects) =>
				prevProjects.filter((p) => p.id !== project.id)
			);

			closeMenu();
		} catch (error) {
			console.error("Something went wrong:", error);
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
				// Si el menú desplegable se desborda hacia abajo, lo muestra hacia arriba
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

	// Función para filtrar proyectos por nombre
	const filteredProjects = projects
		.filter((project) =>
			project.name.toLowerCase().includes(searchText.toLowerCase())
		)
		.slice(currentPage * projectsPerPage, (currentPage + 1) * projectsPerPage);

	// Manejador de paginado
	const handlePageChange = ({ selected }) => {
		setCurrentPage(selected);
	};

	// Proyectos en pantalla
	const displayedProjects = searchText
		? filteredProjects
		: projects.slice(
				currentPage * projectsPerPage,
				(currentPage + 1) * projectsPerPage
		);

	// Función para mostrar el modal de eliminación
	const showDeleteConfirmationModal = (project) => {
		setProjectToDelete(project);
		setShowDeleteModal(true);
	};

	return (
		<div className="project-list-container">
			<nav
				className="navbar navbar-expand-lg fixed-top"
				style={{ zIndex: 1, backgroundColor: "#ffffff" }}
			>
				<div className="container-fluid">
					<a className="navbar-brand" href="/">
						<img id="logo" src={Logo} alt="Logo" style={{ height: "35px" }} />
					</a>
					<button
						className="navbar-toggler"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarSupportedContent"
						aria-controls="navbarSupportedContent"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse" id="navbarSupportedContent">
						<ul className="navbar-nav me-auto mb-2 mb-lg-0">
							<li className="nav-item">
								<a className="nav-link" href="/projects/create">
									Add project
								</a>
							</li>
						</ul>
						<form className="d-flex" role="search">
							<input
								className="form-control me-2"
								type="text"
								placeholder="Search"
								aria-label="Search"
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
							/>
							<button
								className="btn"
								type="submit"
								style={{ backgroundColor: "#8754cb", color: "#ffffff" }}
							>
								Search
							</button>
						</form>
					</div>
				</div>
			</nav>
			<div className="container-fluid" style={{ marginTop: "65px" }}>
				{loading && (
					<div className="loader-container">
						<div className="spinner-border text-secondary m-5" role="status">
							<span className="visually-hidden">Loading...</span>
						</div>
					</div>
				)}
				{error && <p>Error: {error.message}</p>}
				{!loading && !error && (
					<ul className="list-group list-group-flush">
						{displayedProjects.map((project) => (
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
											<BsThreeDotsVertical style={{ color: "#1d1d1d" }} />
										</button>
										{openProjectMenu === project && (
											<div
												className="position-absolute"
												style={{
													...calculateMenuPosition(project),
													backgroundColor: "white",
													width: "100px",
													boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.15)",
													zIndex: 1,
													marginLeft: "-50px",
												}}
											>
												<ul
													className="list-group list-group-flush"
													style={{ cursor: "pointer" }}
												>
													<li
														className="list-group-item d-flex align-items-center"
														onClick={() => handleEdit(project)}
													>
														<Link
															to={`/projects/${project.id}`}
															style={{
																textDecoration: "none",
																color: "#1d1d1d",
															}}
														>
															<BsPencil style={{ marginRight: "8px" }} />
															<span>Edit</span>
														</Link>
													</li>
													<li
														className="list-group-item d-flex align-items-center"
														onClick={() => showDeleteConfirmationModal(project)}
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
			<div className="pagination-container">
				{!loading && (
					<ReactPaginate
						previousLabel={"Previous"}
						nextLabel={"Next"}
						breakLabel={"..."}
						pageCount={Math.ceil(
							projects.filter((project) =>
								project.name.toLowerCase().includes(searchText.toLowerCase())
							).length / projectsPerPage
						)}
						marginPagesDisplayed={2}
						pageRangeDisplayed={5}
						onPageChange={handlePageChange}
						containerClassName={"pagination justify-content-center"}
						activeClassName={"active"}
						previousClassName={"page-item"}
						nextClassName={"page-item"}
						pageClassName={"page-item"}
						pageLinkClassName={"page-link"}
						previousLinkClassName={"page-link"}
						nextLinkClassName={"page-link"}
					/>
				)}
			</div>
			<div
				className={`modal fade ${showDeleteModal ? "show" : ""}`}
				tabIndex="-1"
				role="dialog"
				style={showDeleteModal ? { display: "block" } : {}}
			>
				<div className="modal-dialog modal-dialog-centered" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Confirm deletion</h5>
							<button
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"
								onClick={() => setShowDeleteModal(false)}
							></button>
						</div>
						<div className="modal-body">
							{projectToDelete && (
								<p>
									¿Are you sure that you want to delete{" "}
									<strong>{projectToDelete.name}</strong>?
								</p>
							)}
						</div>
						<div className="modal-footer">
							<button
								type="button"
								className="btn btn-secondary"
								data-bs-dismiss="modal"
								onClick={() => setShowDeleteModal(false)}
							>
								Cancel
							</button>
							<button
								type="button"
								className="btn"
								onClick={() => {
									handleDelete(projectToDelete);
									setShowDeleteModal(false);
								}}
								style={{ backgroundColor: "#8754cb", color: "#ffffff" }}
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
