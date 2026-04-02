// one centralized call for fetching projects on any component

import type { Project } from '../types/Project';

interface FetchProjectsResponse {
  projects: Project[]; // array of Project objects returned from the API
  totalNumProjects: number;
}

const API_URL = 'https://localhost:5000/water'; // base URL for the API endpoint to fetch projects; this should match the URL defined in the backend controller

export const fetchProjects = async (
  pageSize: number,
  pageNum: number,
  selectedCategories: string[]
): Promise<FetchProjectsResponse> => {
  // function to fetch projects from the backend API based on pagination and selected categories
  try {
    const categoryParams = selectedCategories
      .map((cat) => `projectTypes=${encodeURIComponent(cat)}`)
      .join('&');
    // encodeURIComponent is used to ensure that any special characters in the category names are properly encoded for use in a URL; this creates a query string like "projectTypes=Category1&projectTypes=Category2" based on the selected categories

    const response = await fetch(
      `${API_URL}/allprojects?pageHowMany=${pageSize}&pageNumber=${pageNum}${selectedCategories.length ? `&${categoryParams}` : ''}`
    );
    // fetch with parameters -> we're using an if/else shorthand to conditionally add the category parameters to the URL only if selectedCategories is not empty; otherwise, just use the base URL with pagination parameters

    if (!response.ok) {
      throw new Error('Failed to fetch projects'); // throw an error if the response is not ok (e.g., status code is not in the 200-299 range)
    }

    return await response.json(); // parse the response as JSON
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error; // re-throw the error to be handled by the caller
  }
};

// function to add a new project by sending a POST request to the backend API with the project data in the request body
export const addProject = async (newProject: Project): Promise<Project> => { // Promise that there will be a Project object returned from the API after adding the new project (since it's asynchronous)
  try {
      const response = await fetch(`${API_URL}/AddProject`, {
        method: 'POST', // HTTP method for creating a new resource
        headers: {
          'Content-Type': 'application/json', // specify that the request body will be JSON
        },
        body: JSON.stringify(newProject), // convert the newProject object to a JSON string to send in the request body
      });

      if (!response.ok) {
        throw new Error('Failed to add project'); // throw an error if the response is not ok
      }

        return await response.json();
      } catch (error) {
        console.error('Error adding project:', error);
        throw error; // re-throw the error to be handled by the caller
    }
};

export const updateProject = async (projectId: number, updatedProject: Project): Promise<Project> => {
  try {
      const response = await fetch(`${API_URL}/UpdateProject/${projectId}`, {
        method: 'PUT', // HTTP method for updating an existing resource
        headers: {
          'Content-Type': 'application/json', // specify that the request body will be JSON
        },
        body: JSON.stringify(updatedProject), // convert the updatedProject object to a JSON string to send in the request body
      });    

      return await response.json();
  } catch (error) {
    console.error('Error updating project:', error);
    throw error; // re-throw the error to be handled by the caller
  }
}

export const deleteProject = async (projectId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/DeleteProject/${projectId}`, {
      method: 'DELETE', // HTTP method for deleting a resource
    });

    if (!response.ok) {
      throw new Error('Failed to delete project'); // throw an error if the response is not ok
    } 
  } catch (error) {
      console.error('Error deleting project:', error);
      throw error; // re-throw the error to be handled by the caller
    }
};

