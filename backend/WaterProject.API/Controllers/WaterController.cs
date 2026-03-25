using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WaterProject.API.Data;

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
                query = query.Where(p => projectTypes.Contains(p.ProjectType)); // filter the projects based on the provided project types
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

        
    }
}
