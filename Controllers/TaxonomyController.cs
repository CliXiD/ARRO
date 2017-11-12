using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using ARRO.Contexts;
using ARRO.Models;
using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace ARRO.Controllers
{
    public class TaxonomyController : GenericController<Taxonomy, long>
    {
        public TaxonomyController(ApplicationContext context) : base(context)
        {
        }

        public override IEnumerable<Taxonomy> Get([FromQuery]Dictionary<string, string> filter)
        {
            IEnumerable<Taxonomy> result;
            if (filter.Count == 0)
            {
                result = base.Get(filter);
            }
            else if (filter.ContainsKey("parent"))
            {
                result = context.Set<Taxonomy>()
                    .Include(t=>t.Children)
                    .Where(t=> t.ParentId == null)
                    .ToList();
            }
            else if (filter.ContainsKey("name"))
            {
                result = context.Set<Taxonomy>()
                    .Include(t=>t.Parent)
                    .Include(t=>t.Children)
                    .Where(t=> EF.Equals(t.Name.ToLower(), filter["name"].ToLower()))
                    .ToList();
            }
            else{
                result = new List<Taxonomy>();
            }
            foreach(var taxonomy in result)
            {
                if (taxonomy.Children != null)
                {
                    taxonomy.Children = taxonomy.Children.OrderBy(f=>f.Order).ToList();
                }
            }
            return result;
        }

        [HttpGet("{id}")]
        public override IActionResult GetById(long id)
        {
            var result = context.Set<Taxonomy>()
            .Include(
                t=>t.Children
            )
            .Include(
                t=>t.Parent
            ).FirstOrDefault( t=> t.Id == id);

            //var result = collection.SingleOrDefault(item=>EF.Functions.Like(key.GetValue(item).ToString(), id));

            if (result == null)
            {
                return NotFound();
            }

            return new ObjectResult(result); ;
        }
    }
}