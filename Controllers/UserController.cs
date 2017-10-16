using ARRO.Models;
using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using ARRO.Contexts;
using Microsoft.AspNetCore.Mvc;

namespace ARRO.Controllers
{
    public class UserController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        public UserController(ApplicationContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            this._userManager = userManager;
            this._roleManager = roleManager;
        }

        [HttpPost("~/api/user/changepassword")]
        public virtual async System.Threading.Tasks.Task<IActionResult> ChangePassword([FromBody]ChangeUserPassword item)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var user = await _userManager.FindByNameAsync(item.UserName);

                var userResult = await _userManager.ChangePasswordAsync(user, item.CurrentPassword, item.NewPassword);

                if (userResult.Succeeded)
                {
                    return Ok();
                }
                else
                {
                    var result = new ObjectResult(userResult.Errors);
                    result.StatusCode = 500;
                    return result;
                }
            }
            catch (Exception ex)
            {
                var result = new ObjectResult(ex.Message);
                result.StatusCode = 500;
                return result;
            }
        }

        [HttpPost("~/api/user/register")]
        public virtual async System.Threading.Tasks.Task<IActionResult> PostAsync([FromBody]RegisterUser item)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var user = new ApplicationUser()
                {
                    UserName = item.UserName,
                    FirstName = item.FirstName,
                    LastName = item.LastName,
                    Email = item.Email,
                    SecurityStamp = Guid.NewGuid().ToString()
                };
                IdentityResult roleResult;
                IdentityResult userResult;
                
                userResult = await _userManager.CreateAsync(user, item.Password);
                //add user to "Member" role
                if (item.Roles != null && item.Roles.Length > 0)
                {
                    foreach (var roleName in item.Roles)
                    {
                        var roleExist = await _roleManager.RoleExistsAsync(roleName);
                        //check if role exists
                        if (!roleExist)
                        {
                            // create new role
                            roleResult = await _roleManager.CreateAsync(new IdentityRole(roleName));
                        }
                    }
                    userResult = await _userManager.AddToRolesAsync(user, item.Roles);
                }

                return CreatedAtAction("GetById", new { controller = "user", id = user.Id }, user);
            }
            catch (Exception ex)
            {
                var result = new ObjectResult(ex.Message);
                result.StatusCode = 500;
                return result;
            }
        }
    }
}
