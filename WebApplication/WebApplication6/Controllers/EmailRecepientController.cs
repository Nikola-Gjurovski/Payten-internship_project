using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication6.Data;
using WebApplication6.Models;

namespace WebApplication6.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailRecepientController : ControllerBase
    {
        private readonly ApplicationDbContext _configuration;
        public EmailRecepientController(ApplicationDbContext configuration)
        {
            _configuration = configuration;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmailRecepient>>> GetProject()
        {
            if (_configuration.EmailRecepients == null)
            {
                return NotFound();
            }
            return await _configuration.EmailRecepients.ToListAsync();


        }
        [HttpGet("{id}")]
        public async Task<ActionResult<EmailRecepient>> GetProjecta(string id)
        {
            if (_configuration.EmailRecepients == null)
            {
                return NotFound();
            }
            var project = await _configuration.EmailRecepients.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }
            return project;


        }
        [HttpPost]

        public async Task<ActionResult<EmailRecepient>> PostProject(EmailRecepient project)
        {
            project.CreatedAt = DateTime.Now;
            _configuration.EmailRecepients.Add(project);
            await _configuration.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProjecta), new { id = project.Id }, project);


        }
        [HttpPut("{id}")]

        public async Task<ActionResult> PutProject(string id, EmailRecepient project)
        {
            if (id != project.Id)
            {
                return BadRequest("ID mismatch");
            }
            var existingProject = await _configuration.EmailRecepients.FindAsync(id);
            if (existingProject == null)
            {
                return NotFound("User not found");
            }
            existingProject.Email = project.Email;
            existingProject.IsActive = project.IsActive;
            existingProject.Project = project.Project;
            existingProject.UpdatedAt = DateTime.Now;

            try
            {
                await _configuration.SaveChangesAsync();
                return Ok("User updated successfully");
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
        }
        [HttpDelete("{id}")]

        public async Task<ActionResult> DeleteProject(string id)
        {
            if (_configuration.EmailRecepients == null)
            {
                return NotFound();
            }
            var project = await _configuration.EmailRecepients.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }
            _configuration.EmailRecepients.Remove(project);
            await _configuration.SaveChangesAsync();
            return Ok();

        }
        [HttpGet("ByProjectId")]
        public async Task<ActionResult<IEnumerable<EmailRecepient>>> GetVersionsProject(string projectId)
        {
            if (string.IsNullOrEmpty(projectId))
            {
                return BadRequest("Project ID is required");
            }

            var versions = await _configuration.EmailRecepients.Where(v => v.Project == projectId).ToListAsync();

            if (versions == null || versions.Count == 0)
            {
                return NotFound("No versions found for the specified project ID");
            }

            return versions;
        }

    }
}
