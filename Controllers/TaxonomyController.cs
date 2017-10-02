using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using ARRO.Contexts;
using ARRO.Models;
using System;
using Microsoft.AspNetCore.Authorization;

namespace ARRO.Controllers
{
    public class TaxonomyController : GenericController<Taxonomy, long>
    {
        public TaxonomyController(ApplicationContext context) : base(context)
        {
        }
    }
}