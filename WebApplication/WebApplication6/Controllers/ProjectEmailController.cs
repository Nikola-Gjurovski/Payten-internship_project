using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication6.Data;
using WebApplication6.Models;

namespace WebApplication6.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectEmailController : ControllerBase
    {
        private readonly ApplicationDbContext _configuration;
        public ProjectEmailController(ApplicationDbContext configuration)
        {
            _configuration = configuration;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectEmailRecepient>>> GetProject()
        {
            if (_configuration.ProjectEmailRecepients == null)
            {
                return NotFound();
            }
            return await _configuration.ProjectEmailRecepients.ToListAsync();


        }
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectEmailRecepient>> GetProjecta(string id)
        {
            if(_configuration.ProjectEmailRecepients==null)
            {
                return NotFound();
            }
            var project =await _configuration.ProjectEmailRecepients.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }
            return project;
        }

        [HttpPost]
        public async Task<ActionResult<ProjectEmailRecepient>> CreateProj(ProjectEmailRecepient project)
        {
            foreach(var p in _configuration.ProjectEmailRecepients)
            {
                if(p.Email == project.Email && p.Project==project.Project)
                {
                    return Conflict("Email already exist");
                }
            }
            //if (_configuration.ProjectEmailRecepients.Any(p => p.Email == project.Email))
            //{
             
            //}
            project.CreatedAt = DateTime.Now;
            _configuration.Add(project);
            await _configuration.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProjecta),new { id=project.Id}, project);
        }
        [HttpPut("{id}")]

        public async Task<ActionResult> PutProject(string id, ProjectEmailRecepient project)
        {
            if (id != project.Id)
            {
                return BadRequest("ID mismatch");
            }
            //foreach (var p in _configuration.ProjectEmailRecepients)
            //{
            //    if (p.Email == project.Email && p.Project == project.Project)
            //    {
            //        return Conflict("Email already exist");
            //    }
            //}
            var existingProject = await _configuration.ProjectEmailRecepients.FindAsync(id);
            if (existingProject == null)
            {
                return NotFound("Project not found");
            }
            existingProject.Project = project.Project;
            existingProject.Email = project.Email;
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
            if (_configuration.ProjectEmailRecepients == null)
            {
                return NotFound();
            }
            var project = await _configuration.ProjectEmailRecepients.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }
            _configuration.ProjectEmailRecepients.Remove(project);
            await _configuration.SaveChangesAsync();
            return Ok();

        }
    }
}
