import { useEffect, useState } from 'react';
import type { Project } from '../types/Project';
import { deleteProject, fetchProjects } from '../api/ProjectsAPI';
import Pagination from '../components/Pagination';
import NewProjectForm from '../components/NewProjectForm';
import EditProjectForm from '../components/EditProjectForm';

const AdminProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]); // state to hold the list of projects fetched from the backend
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageSize, setPageSize] = useState<number>(10); // state for the number of results per page, with an initial value of 10
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [showForm, setShowForm] = useState(false); // state to control whether the form for adding a new project is shown or hidden
  const [editingProject, setEditingProject] = useState<Project | null>(null); // state to hold the project that is currently being edited; this will be passed to the EditProjectForm component when editing a project

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects(pageSize, pageNum, []); // fetch the current page of projects with the current page size and page number
        setProjects(data.projects);
        setTotalPages(Math.ceil(data.totalNumProjects / pageSize)); // update the total number of pages
      } catch (error) {
        setError((error as Error).message); // set the error state to the error message if an error occurs during the fetch
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [pageSize, pageNum]); // watch for changes in pageSize and pageNum to fetch new data

  const handleDelete = async (projectId: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this project?'); // show a confirmation dialog before deleting a project
    if (!confirmDelete) return; // if the user cancels the deletion, exit the function

    try {
      await deleteProject(projectId);
      // Refresh the project list after deletion
      setProjects(projects.filter((p) => p.projectId !== projectId)); // update the projects state to remove the deleted project from the list
    } catch (error) {
      alert('Failed to delete project. Please try again.'); // show an alert if there was an error during deletion");
    }
  };

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <h1>Admin - Projects</h1>

      {!showForm && (
        <button
          className="btn btn-success mb-3"
          onClick={() => setShowForm(true)}
        >
          Add New Project
        </button>
      )}

      {showForm && (
        <NewProjectForm
          onSuccess={() => {
            setShowForm(false);
            fetchProjects(pageSize, pageNum, []).then((data) =>
              setProjects(data.projects)
            );
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingProject && (
        <EditProjectForm 
          project={editingProject} 
          onSuccess={() => {
            setEditingProject(null);
            fetchProjects(pageSize, pageNum, []).then((data) => 
              setProjects(data.projects));
          }}
          onCancel={() => setEditingProject(null)}
        />
      )}

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Regional Program</th>
            <th>Impact</th>
            <th>Phase</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.projectId}>
              <td>{p.projectId}</td>
              <td>{p.projectName}</td>
              <td>{p.projectType}</td>
              <td>{p.projectRegionalProgram}</td>
              <td>{p.projectImpact}</td>
              <td>{p.projectPhase}</td>
              <td>{p.projectFunctionalityStatus}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm w-100 mb-1"
                  onClick={() => setEditingProject(p)} 
                  // set editingProject state to the project that was clicked -> the EditProjectForm component to be rendered with that project's data for editing
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm w-100"
                  onClick={() => handleDelete(p.projectId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={pageNum} // currentPage must match the naming of the Pagination.tsx props
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPageNum(1); // reset to the first page whenever the page size changes
        }}
      />
    </div>
  );
};

export default AdminProjectsPage;
