using Microsoft.EntityFrameworkCore;
using WaterProject.API.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Add the DbContext to the services container and configure it to use SQLite with the connection string from appsettings.json
builder.Services.AddDbContext<WaterDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("WaterConnection")));

builder.Services.AddCors(options =>
  options.AddPolicy("AllowReactAppBlah",
  policy =>
  {
      policy.WithOrigins(
        "http://localhost:3000",
        "https://agreeable-pebble-0a2bd0110.1.azurestaticapps.net"
      ) // allow requests from local React and deployed Static Web App
          .AllowAnyHeader() // allow any HTTP headers in the request
          .AllowAnyMethod(); // allow any HTTP methods (GET, POST, etc.) in the request
  })); // add CORS services to the container

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowReactAppBlah"); // enable CORS with the defined policy for the React app

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
