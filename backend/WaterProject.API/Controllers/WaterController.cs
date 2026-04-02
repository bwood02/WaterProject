using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WaterProject.API.Data;

// HERE CONTAINS ALL OF OUR API ENDPOINTS FOR MANAGING WATER PROJECTS (CRUD OPERATIONS)

namespace WaterProject.API.Controllers
{
    [Route("[controller]")] // the web path to access this controller will be "/water"
    [ApiController]
    public class WaterController : ControllerBase // inherits from ControllerBase, which provides the basic functionality for an API controller
    {
        private WaterDbContext _waterContext;
        public WaterController(WaterDbContext temp) => _waterContext = temp; // this controller runs when the app starts, allowing us to access the database through _waterContext


        [HttpGet("AllProjects")] // called with "/water/AllProjects" endpoint with a GET request
        public IActionResult GetProjects(int pageHowMany = 10, int pageNumber = 1, [FromQuery] List<string>? projectTypes = null)
        // pageHowMany must be the exact wording in the URL query parameter
        // from the query, we can get a list of project types to filter the projects by, but it is optional ("?") and will be null if not provided
        {            
            // IQueryable is more efficient than using ToList() because it allows for deferred execution
            var query = _waterContext.Projects.AsQueryable(); 

            if (projectTypes != null && projectTypes.Any())
            {
                query = query.Where(p => p.ProjectType != null && projectTypes.Contains(p.ProjectType)); // filter the projects based on the provided project types
            }

            var totalNumProjects = query.Count();

            var something = query
                .Skip((pageNumber - 1) * pageHowMany) // skip all projects from previous pages (determined by pageNumber and pageHowMany)
                .Take(pageHowMany) // take x number of projects after skipping, where x is the value of the pageHowMany query parameter
                .ToList();

            var someObject = new // build a generic object to retun the Projects and the count of Projects
            {
                Projects = something,
                TotalNumProjects = totalNumProjects
            };

            return Ok(someObject); // Ok wraps data in an HTTP response (JSON) with a status code 200

        }

        [HttpGet("GetProjectTypes")] // called with "/water/GetProjectTypes" endpoint with a GET request
        public IActionResult GetProjectTypes()
        {
            var projectTypes = _waterContext.Projects
                .Select(p => p.ProjectType) // select only the ProjectType property from each project
                .Distinct()
                .ToList();

            return Ok(projectTypes); // return the list of distinct project types in an HTTP response (JSON) with a status code 200
        }

        [HttpPost("AddProject")] // 
        public IActionResult AddProject([FromBody] Project newProject) 
        // FromBody means the project data will be sent in the body of the HTTP request as JSON and will be deserialized into a Project object
        {
            _waterContext.Projects.Add(newProject); // add the new project to the database context
            _waterContext.SaveChanges(); // save the changes to the database

            return Ok(newProject); 
        }

        [HttpPut("UpdateProject/{projectId}")] // called with "/water/UpdateProject/{projectId}" endpoint with a PUT request, where {projectId} is the ID of the project to update
        public IActionResult UpdateProject(int projectId, [FromBody] Project updatedProject)
        {
            var existingProject = _waterContext.Projects.Find(projectId); // find the existing project in the database by its ID

            if (existingProject == null) // if the project doesn't exist, return a 404 Not Found response
            {
                return NotFound(new {message = "Project not found"}); 
            }

            // update the properties of the existing project with the values from the updated project
            existingProject.ProjectName = updatedProject.ProjectName;
            existingProject.ProjectType = updatedProject.ProjectType;
            existingProject.ProjectRegionalProgram = updatedProject.ProjectRegionalProgram;
            existingProject.ProjectImpact = updatedProject.ProjectImpact;
            existingProject.ProjectPhase = updatedProject.ProjectPhase;
            existingProject.ProjectFunctionalityStatus = updatedProject.ProjectFunctionalityStatus;

            _waterContext.Update(existingProject);
            _waterContext.SaveChanges(); // save the changes to the database

            return Ok(existingProject);
        }

        [HttpDelete("DeleteProject/{projectId}")] // called with "/water/DeleteProject/{projectId}" endpoint with a DELETE request, where {projectId} is the ID of the project to delete
        public IActionResult DeleteProject(int projectId)
        {
            var project = _waterContext.Projects.Find(projectId); // find the existing project in the database by its ID

            if (project == null) 
            {
                return NotFound(new {message = "Project not found"}); // return a JSON response with a message property
            }

            _waterContext.Projects.Remove(project); // remove the project from the database context
            _waterContext.SaveChanges(); 

            return NoContent(); // NoContent indicates success with a status code of 204 and no response body
        }
    }
}
