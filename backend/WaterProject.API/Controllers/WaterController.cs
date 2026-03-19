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
        public IActionResult GetProjects(int pageHowMany = 10, int pageNumber = 1) // pageHowMany must be the exact wording in the URL query parameter
        // pass in a query parameter to specify how many projects to return; default is 10 if no query parameter is provided
        {
            var something = _waterContext.Projects 
                .Skip((pageNumber - 1) * pageHowMany) // skip all projects from previous pages (determined by pageNumber and pageHowMany)
                .Take(pageHowMany) // take x number of projects after skipping, where x is the value of the pageHowMany query parameter
                .ToList();

            var totalNumProjects = _waterContext.Projects.Count();

            var someObject = new // build a generic object to retun the Projects and the count of Projects
            {
                Projects = something,
                TotalNumProjects = totalNumProjects
            };

            return Ok(someObject); // Ok wraps data in an HTTP response (JSON) with a status code 200

        }

        [HttpGet("FunctionalProjects")] // called with "/water/FunctionalProjects" endpoint with a GET request
        public IEnumerable<Project> GetFunctionalProjects(int pageNumber = 1) 
        {
            var something = _waterContext.Projects.Where(x => x.ProjectFunctionalityStatus == "Functional").ToList(); // return all the projects in the Projects table where the ProjectFunctionalityStatus is "Functional"
            return something;
        }
    }
}
