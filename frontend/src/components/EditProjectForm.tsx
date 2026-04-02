import { useState } from 'react';
import type { Project } from '../types/Project';
import { updateProject } from '../api/ProjectsAPI';

interface EditProjectFormProps {
  project: Project; // the project to be edited, which will be passed as a prop from the parent component; this allows the form to be pre-populated with the existing project data for editing
  onSuccess: () => void; // callback function to be called after successfully adding a new project, which can be used to refresh the project list or perform other actions in the parent component
  onCancel: () => void; // callback function to be called when the user cancels adding a new project, which can be used to close the form or perform other actions in the parent component
}

const EditProjectForm = ({ project, onSuccess, onCancel }: EditProjectFormProps) => {
  const [formData, setFormData] = useState<Project>({...project}); // initialize formData state with the existing project data for editing

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // handleChange function to update the formData state whenever an input field changes; uses the name attribute of the input to determine which field to update
    setFormData({...formData, [e.target.name]: e.target.value }); // take the previous formData and update the specific field that changed with the new value from the input
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // don't refresh the page on form submission
    await updateProject(formData.projectId, formData);
    onSuccess(); // call the onSuccess callback to notify the parent component that a new project has been added successfully
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form inputs for each project field, bound to the formData state */}
      <h2>Edit Project</h2>
      <label>
        Project Name:
        <input 
          type="text" 
          name="projectName" 
          value={formData.projectName} 
          onChange={handleChange}
        />
      </label>
      <label>
        Project Type:
        <input 
          type="text" 
          name="projectType" 
          value={formData.projectType} 
          onChange={handleChange}
        />
      </label>
      <label>
        Regional Program:
        <input 
          type="text" 
          name="projectRegionalProgram" 
          value={formData.projectRegionalProgram} 
          onChange={handleChange}
        />
      </label>
      <label>
        Impact:
        <input 
          type="number" 
          name="projectImpact" 
          value={formData.projectImpact} 
          onChange={handleChange}
        />
      </label>
      <label>
        Phase:
        <input 
          type="text" 
          name="projectPhase" 
          value={formData.projectPhase} 
          onChange={handleChange}
        />
      </label>
      <label>
        Project Functionality Status:
        <input 
          type="text" 
          name="projectFunctionalityStatus" 
          value={formData.projectFunctionalityStatus} 
          onChange={handleChange}
        />
      </label>
      <button type="submit">Update Project</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  )
};

export default EditProjectForm;
