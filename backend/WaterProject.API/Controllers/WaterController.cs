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
        public IEnumerable<Project> GetProjects() // this method will be called when we access the "api/water" endpoint with a GET request
        {
            var something = _waterContext.Projects.ToList(); // return all the projects in the Projects table as a list
            return something;
        }

        [HttpGet("FunctionalProjects")] // called with "/water/FunctionalProjects" endpoint with a GET request
        public IEnumerable<Project> GetFunctionalProjects()
        {
            var something = _waterContext.Projects.Where(x => x.ProjectFunctionalityStatus == "Functional").ToList(); // return all the projects in the Projects table where the ProjectFunctionalityStatus is "Functional"
            return something;
        }
    }
}
