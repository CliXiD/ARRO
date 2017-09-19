using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using ARRO.Contexts;
using System.Reflection;
using System;
using ARRO.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using AspNet.Security.OpenIdConnect.Server;
using AspNet.Security.OAuth.Validation;

namespace ARRO.Controllers
{
    [Authorize(AuthenticationSchemes = OAuthValidationDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    abstract public class GenericController<T,KeyType> : Controller where T:class{
        protected ApplicationContext context;
        public GenericController(ApplicationContext context){
            this.context = context;
        }
        /// Create
        
        [HttpPost]
        public virtual IActionResult Post([FromBody]T item)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var key = typeof(T).GetProperties().FirstOrDefault(p => 
                p.CustomAttributes.Any(attr => attr.AttributeType == typeof(KeyAttribute)));
                context.Add(item);
                context.SaveChanges();
                return CreatedAtAction("GetById", new { controller = typeof(T).Name.ToLower(), id = (KeyType)key.GetValue(item) }, item);
            }
            catch (Exception ex)
            {
                var result = new ObjectResult(ex.Message);
                result.StatusCode = 500;
                return result;
            }
        }

        ///Read all entities
        [HttpGet]
        public virtual IEnumerable<T> Get([FromQuery]Dictionary<string, string> filter)
        {
            var result = context.Set<T>().ToList();
            return result;
        }

        /// Read single entity
        [HttpGet("{id}")]
        public virtual IActionResult GetById(KeyType id)
        {
            var result = context.Find(typeof(T),new object[] {id});
            
            //var result = collection.SingleOrDefault(item=>EF.Functions.Like(key.GetValue(item).ToString(), id));

            if (result == null)
            {
                return NotFound();
            }

            return new ObjectResult(result);;
        }

        [HttpPut("{id}")]
        public virtual IActionResult Update(KeyType id,[FromBody] T item)
        {
            var key = typeof(T).GetProperties().FirstOrDefault(p => 
                p.CustomAttributes.Any(attr => attr.AttributeType == typeof(KeyAttribute)));

            // if (item == null || !((KeyType) key.GetValue(item)).Equals(id))
            // {
            //     return BadRequest();
            // }

            var result = context.Find(typeof(T),new object[] {id});
            if (result == null)
            {
                return NotFound();
            }

            var tProperties = typeof(T).GetProperties();
            foreach(var prop in tProperties)
            {
                prop.SetValue(result, prop.GetValue(item));
            }

            context.Update(result);
            context.SaveChanges();
            return new NoContentResult();
        }

        [HttpDelete("{id}")]
        public virtual IActionResult Delete(KeyType id)
        {
            var result = context.Find(typeof(T),new object[] {id});
            if (result == null)
            {
                return NotFound();
            }
            context.Remove(result);
            context.SaveChanges();
            return new NoContentResult();
        }
    }
}