/* eslint-disable no-useless-catch */
const ASSIGNMENTS_URL = import.meta.env.VITE_ASSIGNMENTS_URL;

export async function getAssignments() {
	try {
		const response = await fetch(ASSIGNMENTS_URL);

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		return response.json();
	} catch (error) {
		throw error;
	}
}

export async function getAssignment(id) {
	try {
		const response = await fetch(`${ASSIGNMENTS_URL}/${id}`);

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		return response.json();
	} catch (error) {
		throw error;
	}
}
