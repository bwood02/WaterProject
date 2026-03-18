import { useEffect, useState } from "react";
import type { Project } from "./types/Project";

function ProjectList() {
    
    // array of projects (Project.ts) and a function to update the projects (setProjects) using the useState hook; initial value of projects is an empty array
    const [projects, setProjects] = useState<Project[]>([]); 

    useEffect(() => { // useEffect fetches data when the page is built
        const fetchProjects = async () => {
            const response = await fetch("https://localhost:5000/water/allprojects"); // fetch data from the backend API endpoint
            const data = await response.json(); // parse the response as JSON
            setProjects(data); // set the projects state to the data received from the backend
        };

        fetchProjects();
    }, []); // if nothing comes back, give an empty array; run only once, when the component is first rendered

    return (
        <main className="app">
            <h1 className="page-title">Water Projects</h1>
            <section className="project-list">
                {projects.map((p) => (
                    <article className="project-card" key={p.projectId}>
                        <h3>{p.projectName}</h3>
                        <ul>
                            <li><strong>Project Type:</strong> {p.projectType}</li>
                            <li><strong>Regional Program:</strong> {p.projectRegionalProgram}</li>
                            <li><strong>Impact:</strong> {p.projectImpact}</li>
                            <li><strong>Phase:</strong> {p.projectPhase}</li>
                            <li><strong>Functionality Status:</strong> {p.projectFunctionalityStatus}</li>
                        </ul>
                    </article>
                ))}
            </section>
        </main>

    );
}

export default ProjectList;