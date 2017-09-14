using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace ARRO.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }

    }
}