using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using ARRO.Models;
namespace ARRO.Contexts
{
    public class ApplicationContext : IdentityDbContext
    {
        private const string _isDeleted = "IsDeleted";
        private const string _createdDate = "CreatedDate";
        private const string _updatedDate = "UpdatedDate";
        public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options)
        {
            //Database.EnsureCreated();
        }
        public DbSet<Taxonomy> Taxonomy { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            //Map to table name
            modelBuilder.Entity<Taxonomy>().ToTable("Taxonomy");
            //Define defualt value and behavior for change after save
            modelBuilder.Entity<Taxonomy>().Property(f => f.ID)
                .ValueGeneratedOnAdd();
            modelBuilder.Entity<Taxonomy>().Property(p => p.CreatedDate)
                .HasDefaultValueSql("getutcdate()")
                .Metadata.AfterSaveBehavior = PropertySaveBehavior.Ignore;
            modelBuilder.Entity<Taxonomy>().Property(p => p.UpdatedDate)
                .HasDefaultValueSql("getutcdate()")
                .ValueGeneratedOnAddOrUpdate()
                .Metadata.AfterSaveBehavior = PropertySaveBehavior.Save;

            //Define private property for filtering for soft delete
            modelBuilder.Entity<Taxonomy>().Property<bool>(_isDeleted);
            modelBuilder.Entity<Taxonomy>().HasQueryFilter(i => !EF.Property<bool>(i, _isDeleted));
        }

        //private Task<ApplicationUser> GetCurrentUserAsync() => _userManager.(_contextAccessor.HttpContext.User);

        public override int SaveChanges()
        {
            ChangeTracker.DetectChanges();
            //foreach (var item in ChangeTracker.Entries<BaseModel>().Where(e => e.State == EntityState.Added))
            //{
            //item.CurrentValues["CreatedBy"] = currentUser;
            //item.CurrentValues["UpdatedBy"] = currentUser;
            //}

            //foreach (var item in ChangeTracker.Entries<BaseModel>().Where(e => e.State == EntityState.Added))
            //{
            //item.CurrentValues["UpdatedBy"] = currentUser;
            //}

            foreach (var item in ChangeTracker.Entries<Taxonomy>().Where(e => e.State == EntityState.Deleted))
            {
                item.State = EntityState.Modified;
                item.CurrentValues[_isDeleted] = true;
            }

            return base.SaveChanges();
        }
    }
}