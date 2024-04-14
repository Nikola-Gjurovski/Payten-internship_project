namespace WebApplication6.Models
{
    public class ProjectEmailRecepient
    {
        public string Id { get; set; }
        public string ?Email { get; set; }  
        public string ?Project { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
