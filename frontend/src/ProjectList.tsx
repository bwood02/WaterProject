import { useEffect, useState } from "react";
import type { Project } from "./types/Project";

function ProjectList() {
    
    // array of projects (Project.ts) and a function to update the projects (setProjects) using the useState hook; initial value of projects is an empty array
    const [projects, setProjects] = useState<Project[]>([]); 
    const [pageSize, setPageSize] = useState<number>(10); // state for the number of results per page, with an initial value of 10
    const [pageNum, setPageNum] = useState<number>(1); // state for the current page number, with an initial value of 1
    const [totalProjects, setTotalProjects] = useState<number>(0); 
    const [totalPages, setTotalPages] = useState<number>(0);

    useEffect(() => { // useEffect fetches data when the page is built
        const fetchProjects = async () => {
            const response = await fetch(`https://localhost:5000/water/allprojects?pageHowMany=${pageSize}&pageNumber=${pageNum}`); 
                // fetch data from the backend API endpoint, with parameters for pagination (pageHowMany) based on the pageSize state
            const data = await response.json(); // parse the response as JSON
            setProjects(data.projects); // set the projects state to the data received from the backend - MUST match the JSON structure (including a lowercase "p" in "projects")
            setTotalProjects(data.totalNumProjects); 
            setTotalPages(Math.ceil(totalProjects / pageSize)); // set the total number of pages based on total # of projects and the page size (using Math.ceil to round up to the nearest whole number)
        };

        fetchProjects();
    }, [pageSize, pageNum, totalProjects]); // this is called the dependency array -> tells useEffect to watch for changes in pageSize, pageNum, & totalProjects, and run fetchProjects whenever either state changes  
                                            // this is important for pagination, as it allows the component to fetch new data whenever the user changes the page or the number of results per page

    return (
        <>
            <h1>Water Projects</h1>
            <br />
            {projects.map((p) => (
                <div id="projectCard" className="card" key={p.projectId}>
                    <h3 className="card-title">{p.projectName}</h3>
                    <div className="card-body">
                    <ul className="list-unstyled">
                        <li><strong>Project Type:</strong> {p.projectType}</li>
                        <li><strong>Regional Program:</strong> {p.projectRegionalProgram}</li>
                        <li><strong>Impact:</strong> {p.projectImpact} Individuals Served</li>
                        <li><strong>Phase:</strong> {p.projectPhase}</li>
                        <li><strong>Project Status:</strong> {p.projectFunctionalityStatus}</li>
                    </ul>
                    </div>
                </div>
            ))}

            {/* // pagination controls -> disable the "Previous" button if the user is on the 1st page and disable the "Next" button if the user 
                //      is on the last page; when a page number button is clicked, update the pageNum state to the corresponding page number */}
            <button 
                disabled={pageNum === 1} 
                onClick={() => setPageNum(pageNum - 1)}>
                Previous
            </button>

            { // create an array of the total number of pages and map over it to create a button for each page; the key for each button 
              //    is the page number (i + 1) and the onClick handler sets the pageNum state to the corresponding page number when clicked
              // disable the button for the current page (pageNum === i + 1) to indicate which page the user is currently on
                [...Array(totalPages)].map((_, i) => ( 
                    <button key={i + 1} onClick={() => setPageNum(i + 1)} disabled={pageNum === (i + 1)}> 
                        {i + 1} 
                    </button>
                ))
            }

            <button disabled={pageNum === totalPages} onClick={() => setPageNum(pageNum + 1)}> 
                Next
            </button>

            <br />
            <label>Results per page: 
            {/* when a page size is selected, update the pageSize state with the new value; convert to a number using Number()  */}
            <select 
                value={pageSize} 
                onChange={(p) => {
                    setPageSize(Number(p.target.value));
                    setPageNum(1); // reset to the first page whenever the page size changes
                    }}> 
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
            </select>
            </label>

        </>


    );
}

export default ProjectList;