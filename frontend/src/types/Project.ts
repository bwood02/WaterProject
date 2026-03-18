// the template for the project object, which will be used to type the data we get from the backend
export interface Project {
    projectId: number;
    projectName: string;
    projectType: string;
    projectRegionalProgram: string;
    projectImpact: number;
    projectPhase: string;
    projectFunctionalityStatus: string;
}