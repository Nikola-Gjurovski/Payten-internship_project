﻿namespace WebApplication6.Models
{
    public class Project
    {
        public string Id { get; set; }    
        public string Name { get; set; }
        public string Description { get; set; }
        public bool ?IsActive { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime ?UpdatedAt { get; set; }
    }
}
