using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ARRO.Models
{
    public class Taxonomy : BaseModel
    {
        [Key]
        public long Id { get; set; }
        public string Name { get; set; }
        public string Caption { get; set; }
        public long? ParentId { get; set; }
        public virtual Taxonomy Parent { get; set; }
        public ICollection<Taxonomy> Children { get; set; }
        
    }
}