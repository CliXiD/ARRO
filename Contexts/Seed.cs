using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ARRO.Models;
namespace ARRO.Contexts
{
    public static class Seed
    {
        public static async void InitializeAsync(ApplicationContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            var _userManager = userManager;
            var _roleManager = roleManager;
            string[] roleNames = { "Admin", "Member" };
            IdentityResult roleResult;
            List<Taxonomy> _taxonomy = new List<Taxonomy>
            {
                new Taxonomy()
                {
                    Name = "th",
                    Caption = "ไทย",
                    Group = "language"
                },
                new Taxonomy()
                {
                    Name = "en",
                    Caption = "English",
                    Group = "language"
                }
            };

            List<ApplicationUser> _users = new List<ApplicationUser>
            {
                new ApplicationUser()
                {
                    UserName="admin",
                    FirstName = "Administrator",
                    LastName = "Admin",
                    Email = "admin@ARRO.com",
                    SecurityStamp=Guid.NewGuid().ToString()
                }
            };
            foreach (var roleName in roleNames)
            {
                var roleExist = await _roleManager.RoleExistsAsync(roleName);
                //check if role exists
                if (!roleExist)
                {
                    // create new role
                    roleResult = await _roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }

            if (!context.Taxonomy.Any())
            {
                context.AddRange(_taxonomy);
                await context.SaveChangesAsync();
            }
            if (!context.Users.Any())
            {
                foreach (ApplicationUser _user in _users)
                {
                    // create user
                    await _userManager.CreateAsync(_user, "project0*");
                    //add user to "Member" role
                    await _userManager.AddToRoleAsync(_user, "Admin");
                }
            }
        }
    }
}