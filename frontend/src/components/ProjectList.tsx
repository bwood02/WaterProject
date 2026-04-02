import { useEffect, useState } from 'react';
import type { Project } from '../types/Project';
import { useNavigate } from 'react-router-dom';
import { fetchProjects } from '../api/ProjectsAPI';
import Pagination from './Pagination';

function ProjectList({ selectedCategories }: { selectedCategories: string[] }) {
  // ProjectList receives the selectedCategories state as a prop from the App component; it uses this state to filter the projects
  // array of projects (Project.ts) and a function to update the projects (setProjects) using the useState hook; initial value of projects is an empty array
  const [projects, setProjects] = useState<Project[]>([]);
  const [pageSize, setPageSize] = useState<number>(10); // state for the number of results per page, with an initial value of 10
  const [pageNum, setPageNum] = useState<number>(1); // state for the current page number, with an initial value of 1
  const [totalPages, setTotalPages] = useState<number>(0);
  const navigate = useNavigate(); // hook from react-router-dom that allows us to programmatically navigate to different routes in our application
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // useEffect fetches data when the page is built
    const loadProjects = async () => {
      try {
        setLoading(true); // set loading to true before starting the fetch
        const data = await fetchProjects(pageSize, pageNum, selectedCategories); // call the fetchProjects function with the current page size, page number, and selected categories; this function is defined in ProjectsAPI.ts and makes the actual API call to the backend

        setProjects(data.projects); // set the projects state to the data received from the backend - MUST match the JSON structure (including a lowercase "p" in "projects")
        setTotalPages(Math.ceil(data.totalNumProjects / pageSize)); // set the total number of pages based on total # of projects and the page size (using Math.ceil to round up to the nearest whole number)}
      } catch (error) {
        setError((error as Error).message); // set the error state to the error message if an error occurs during the fetch
      } finally {
        setLoading(false); // set loading to false after the fetch is complete, regardless of success or failure
      }
    };

    loadProjects();
  }, [pageSize, pageNum, selectedCategories]);
  // this is called the dependency array -> tells useEffect to watch for changes in pageSize, pageNum, & totalProjects, and run fetchProjects whenever either state changes
  // this is important for pagination, as it allows the component to fetch new data whenever the user changes the page or the number of results per page

  if (loading) return <p>Loading projects...</p>; // display a loading message while the data is being fetched
  if (error) return <p className="text-red-500">Error: {error}</p>; // display an error message if there was an error during the fetch

  return (
    <>
      {projects.map((p) => (
        <div id="projectCard" className="card" key={p.projectId}>
          <h3 className="card-title">{p.projectName}</h3>
          <div className="card-body">
            <ul className="list-unstyled">
              <li>
                <strong>Project Type: </strong>
                {p.projectType}
              </li>
              <li>
                <strong>Regional Program: </strong>
                {p.projectRegionalProgram}
              </li>
              <li>
                <strong>Impact: </strong>
                {p.projectImpact} Individuals Served
              </li>
              <li>
                <strong>Phase: </strong>
                {p.projectPhase}
              </li>
              <li>
                <strong>Project Status: </strong>
                {p.projectFunctionalityStatus}
              </li>
            </ul>

            <button
              className="btn btn-success"
              onClick={() =>
                navigate(`/donate/${p.projectName}/${p.projectId}`)
              }
            >
              Donate
            </button>
            {/* when the "Donate" button is clicked, use the navigate function to programmatically navigate to the "/donate" route, which will render the DonatePage component */}
          </div>

        </div>
      ))}

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
    </>
  );
}

export default ProjectList;
