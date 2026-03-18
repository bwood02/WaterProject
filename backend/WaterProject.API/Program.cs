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

builder.Services.AddCors(); // add CORS services to the container

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors(x => x.WithOrigins("http://localhost:3000"));

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
