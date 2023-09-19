/* eslint-disable no-useless-catch */
const PROJECTS_URL = import.meta.env.VITE_PROJECTS_URL;

export async function getProjects(signal) {
	const url = new URL(PROJECTS_URL);
	
	try {
		const response = await fetch(url.toString(), { signal });

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		return response.json();
	} catch (error) {
		throw error;
	}
}

export async function getProject(id) {
	try {
		const response = await fetch(`${PROJECTS_URL}/${id}`);

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		return response.json();
	} catch (error) {
		throw error;
	}
}

export async function createProject(projectData) {
	try {
		const response = await fetch(PROJECTS_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(projectData),
		});

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		return response.json();
	} catch (error) {
		throw error;
	}
}

export async function updateProject(id, updatedData) {
	try {
		const response = await fetch(`${PROJECTS_URL}/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updatedData),
		});

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		return response.json();
	} catch (error) {
		throw error;
	}
}

export async function deleteProject(id) {
	try {
		await fetch(`${PROJECTS_URL}/${id}`, {
			method: "DELETE",
		});
	} catch (error) {
		throw error;
	}
}