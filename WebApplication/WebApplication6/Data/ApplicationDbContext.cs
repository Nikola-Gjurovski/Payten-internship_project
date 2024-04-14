using Microsoft.EntityFrameworkCore;
using WebApplication6.Models;

namespace WebApplication6.Data
{
    public class ApplicationDbContext:DbContext
    {
   
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        public virtual DbSet<Project> Project { get; set; }
        public virtual DbSet<VersionP> Version { get; set; }
        public virtual DbSet<EmailRecepient>EmailRecepients { get; set; }
        public virtual DbSet<ProjectEmailRecepient> ProjectEmailRecepients { get; set; }
    }
}
