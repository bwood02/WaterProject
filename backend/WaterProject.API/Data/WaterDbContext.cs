using Microsoft.EntityFrameworkCore;
using System.Data.Common;
using System.Security.Cryptography.X509Certificates;

namespace WaterProject.API.Data
{
    public class WaterDbContext : DbContext
    {
        public WaterDbContext(DbContextOptions<WaterDbContext> options) : base(options) // pass the options to the base DbContext class
        { 
            // the DbContext file is the liaison between the database and the application
        }

        public DbSet<Project> Projects { get; set; } // create a Projects table of type Project in the DB

    }
}
