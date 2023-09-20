/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { getProjects, updateProject } from "../utils/projectControllers";
import { useParams } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";

export default function EditProjectForm() {
  const [projects, setProjects] = useState([])
  const { projectId } = useParams();

  useEffect(() => {
		async function fetchData() {
			try {
				const projects = await getProjects();

				setProjects(projects);
			} catch (error) {
				console.error("Error al cargar datos", error);
			}
		}

		fetchData();
	}, []);

  const project = projects.find((p) => p.id === projectId);

const [formData, setFormData] = useState({
  name: project?.name || "",
  description: project?.description || "",
  projectManager: project?.projectManager || "",
  assignedTo: project?.assignedTo || "",
  status: project?.status || "",
});


  useEffect(() => {
    setFormData({
      name: project?.name || "",
      description: project?.description || "",
      projectManager: project?.projectManager || "",
      assignedTo: project?.assignedTo || "",
      status: project?.status || "",
    });
  }, [project]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProject(projectId, formData);
      console.log("Proyecto actualizado con éxito.");
    } catch (error) {
      console.error("Error al actualizar el proyecto:", error);
    }
  };

  return (
    <>
    <nav className="navbar fixed-top">
				<div className="container-fluid">
        <form className="d-flex">
						<button className="btn" type="button">
							<a
								href="/"
								style={{ textDecoration: "none", color: "#1d1d1d" }}
							>
                <BsArrowLeft style={{marginRight: "8px"}} />
								Back
							</a>
						</button>
					</form>
					<p className="navbar-brand">
						Edit project
					</p>
				</div>
			</nav>
    <div className="container-fluid" style={{ padding: "1rem", marginTop: "50px" }}>
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
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Descripción
          </label>
          <textarea
            type="text"
            className="form-control"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
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
          />
        </div>
        <div className="mb-3">
          <label htmlFor="assignedTo" className="form-label">
            Assignment
          </label>
          <input
            type="text"
            className="form-control"
            id="assignedTo"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleInputChange}
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
          />
        </div>
        <button type="submit" className="btn btn-danger">
          Save changes
        </button>
      </form>
    </div>
    </>
  );
}
