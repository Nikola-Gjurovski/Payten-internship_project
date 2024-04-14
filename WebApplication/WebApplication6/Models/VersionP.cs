namespace WebApplication6.Models
{
    public class VersionP
    {
        public string Id { get; set; }
        public string ?version_type {  get; set; }
        public string? ProjectId { get; set; }
       // public Project ?Project { get; set; }
        public string? Changes { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        //public string? name { get; set; }

    }
}
