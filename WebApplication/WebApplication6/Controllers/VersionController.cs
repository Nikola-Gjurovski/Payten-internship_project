using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication6.Data;
using WebApplication6.Models;

namespace WebApplication6.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VersionController : ControllerBase
    {
        private readonly ApplicationDbContext _configuration;
        public VersionController(ApplicationDbContext configuration)
        {
            _configuration = configuration;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VersionP>>> GetVersions()
        {
            if (_configuration.Project == null)
            {
                return NotFound();
            }
            return await _configuration.Version.ToListAsync();


        }
        [HttpGet("{id}")]
        public async Task<ActionResult<VersionP>> GetVersion(string id)
        {
            if (_configuration.Version == null)
            {
                return NotFound();
            }
            var project = await _configuration.Version.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }
            return project;


        }
        [HttpPost]

        public async Task<ActionResult<VersionP>> PostVersion(VersionP project)
        {
            project.CreatedAt = DateTime.Now;
            _configuration.Version.Add(project);
            await _configuration.SaveChangesAsync();
            return CreatedAtAction(nameof(GetVersion), new { id = project.Id }, project);


        }
        [HttpPut("{id}")]

        public async Task<ActionResult> PutVersion(string id, VersionP project)
        {
            //if (id != project.Id)
            //{
            //    return NotFound();
            //}
            //_configuration.Entry(project).State = EntityState.Modified;
            //try
            //{
            //    await _configuration.SaveChangesAsync();
            //}
            //catch (DbUpdateConcurrencyException)
            //{
            //    throw;
            //}
            //return Ok();

            if (id != project.Id)
            {
                return BadRequest("ID mismatch");
            }
            var existingProject = await _configuration.Version.FindAsync(id);
            if (existingProject == null)
            {
                return NotFound("Version not found");
            }
            existingProject.Changes = project.Changes;
            existingProject.ProjectId = project.ProjectId;
            existingProject.IsActive = project.IsActive;
            existingProject.version_type = project.version_type;
            existingProject.UpdatedAt = DateTime.Now;

            try
            {
                await _configuration.SaveChangesAsync();
                return Ok("Version updated successfully");
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
        }
        [HttpDelete("{id}")]

        public async Task<ActionResult> DeleteVersion(string id)
        {
            if (_configuration.Version == null)
            {
                return NotFound();
            }
            var project = await _configuration.Version.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }
            _configuration.Version.Remove(project);
            await _configuration.SaveChangesAsync();
            return Ok();

        }
        [HttpGet("ByProjectId")]
        public async Task<ActionResult<IEnumerable<VersionP>>> GetVersionsProject(string projectId)
        {
            if (string.IsNullOrEmpty(projectId))
            {
                return BadRequest("Project ID is required");
            }

            var versions = await _configuration.Version.Where(v => v.ProjectId == projectId).ToListAsync();

            if (versions == null || versions.Count == 0)
            {
                return NotFound("No versions found for the specified project ID");
            }

            return versions;
        }
    }
}
