using System.ComponentModel.DataAnnotations;

namespace ARRO.Models
{
    public class Taxonomy : BaseModel
    {
        [Key]
        public long ID { get; set; }
        public string Name { get; set; }
        public string Caption { get; set; }
        public string Group { get; set; }
    }
}