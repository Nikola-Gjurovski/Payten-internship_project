using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Data.SqlClient;
using WebApplication6.Data;
using WebApplication6.Models;

namespace WebApplication6.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {

        private readonly ApplicationDbContext _configuration;
        public ProjectController(ApplicationDbContext configuration)
        {
            _configuration = configuration;
        }
        [HttpGet]
       public async Task<ActionResult<IEnumerable<Project>>> GetProject()
        {
            if (_configuration.Project == null)
            {
                return NotFound();
            }
            return await _configuration.Project.ToListAsync();


        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetProjecta(string id)
        {
            if (_configuration.Project == null)
            {
                return NotFound();
            }
            var project = await _configuration.Project.FindAsync(id);
            if(project == null)
            {
                return NotFound();
            }
            return project;


        }
        [HttpPost]
       
        public async Task<ActionResult<Project>> PostProject(Project project)
        {
            project.CreatedAt = DateTime.Now;
            _configuration.Project.Add(project);
            await _configuration.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProjecta),new {id=project.Id},project);


        }
        [HttpPut("{id}")]
        
        public async Task<ActionResult> PutProject(string id,Project project)
        {
            if (id != project.Id)
            {
                return BadRequest("ID mismatch");
            }
            var existingProject = await _configuration.Project.FindAsync(id);
            if (existingProject == null)
            {
                return NotFound("Project not found");
            }
            existingProject.Name = project.Name;
            existingProject.Description = project.Description;
            existingProject.IsActive = project.IsActive;
            existingProject.UpdatedAt = DateTime.Now;

            try
            {
                await _configuration.SaveChangesAsync();
                return Ok("Project updated successfully");
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
        }
        [HttpDelete("{id}")]

        public async Task<ActionResult> DeleteProject(string id)
        {
            if (_configuration.Project == null)
            {
                return NotFound();
            }
            var project = await _configuration.Project.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }
            _configuration.Project.Remove(project);
            await _configuration.SaveChangesAsync();
            return Ok();

        }

    }
}
