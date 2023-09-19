/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { getProjects } from "../utils/projectControllers";
import { getAssignments } from "../utils/assignmentControllers";

export default function ProjectList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        const [projectResponse, assignmentResponse] = await Promise.all([
          getProjects(signal),
          getAssignments()
        ]);

        // Crea un objeto de asignaciones con ID como clave
        const assignmentMap = {};
        assignmentResponse.forEach(assignment => {
          assignmentMap[assignment.id] = assignment;
        });

        setAssignments(assignmentMap);

        // Asocia las asignaciones a los proyectos
        const projectsWithAssignments = projectResponse.map(project => ({
          ...project,
          assignment: assignmentMap[project.assignedTo]
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

  return (
		<div className="container-fluid">
      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error.message}</p>}
      {!loading && !error && (
        <ul className="list-group w-100">
          {projects.map((project) => (
            <li key={project.id} className="list-group-item">
              <h3>{project.name}</h3>
              <div className="media">
                {project.assignment && (
                  <img
                    src={project.assignment.image}
                    alt="Avatar"
                    className="rounded-circle mr-3"
                    width="50"
                    height="50"
                  />
                )}
                <div className="media-body">
                  <p className="mb-0">Creation date: {project.createdAt}</p>
                  <p className="mb-0">{project.assignment ? project.assignment.name : 'Sin asignar'}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
