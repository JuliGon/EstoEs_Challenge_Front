/* eslint-disable no-useless-catch */
const PMS_URL = import.meta.env.VITE_PMS_URL;

export async function getPMs() {
	try {
		const response = await fetch(PMS_URL);

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		return response.json();
	} catch (error) {
		throw error;
	}
}

export async function getPM(id) {
	try {
		const response = await fetch(`${PMS_URL}/${id}`);

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		return response.json();
	} catch (error) {
		throw error;
	}
}
