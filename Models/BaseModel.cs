using System;

namespace ARRO.Models
{
    public class BaseModel
    {
        public DateTime CreatedDate {get;set;}
        public DateTime UpdatedDate {get;set;}
        public ApplicationUser CreatedBy {get;set;}
        public ApplicationUser UpdatedBy {get;set;}
    }
}