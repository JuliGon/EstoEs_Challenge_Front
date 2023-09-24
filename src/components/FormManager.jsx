/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import CreateProjectForm from "./CreateProjectForm";
import EditProjectForm from "./EditProjectForm";

export default function FormManager({ isEditMode }) {
	const [editMode, setEditMode] = useState(isEditMode);

	return <div>{editMode ? <EditProjectForm /> : <CreateProjectForm />}</div>;
}
