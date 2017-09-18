# ARRO

ASP NET Core with React, Redux and OpenIdDict project template
Inspiration from <https://github.com/aspnet/templating>

I create this project for learning in ASPNET Core, React, Redux and also to have it as seed project for simple CRUD web application.

Including key libraries:

- OpenIdDict : <https://github.com/openiddict/openiddict-core> (Password flow)
- Redux-Form : <https://github.com/erikras/redux-form>
- React Transition Group : <https://github.com/reactjs/react-transition-group>
- EF Core 2 : <https://github.com/aspnet/EntityFrameworkCore>
- Blar Blar Blar, feel free to let me know if any awesome lib should be include in this project

Features in this projects:

- Authentication and Authorization (Password flow) which not included in DOTNET SPA Template yet
- DynamicForm (in development)
- DynamicTable to create simple table by configuration
- AlertControl
- GenericController for generic REST APIs such as GET (all/by id), PUT, POST, DELETE which can help to create new APIs for an entity

This project also including .template.config so you can install this project as a part of dotnet project template too.

To install this project in dotnet template, download or clone this project to your machine and run
>dotnet new -i full/path/to/project/root

To create project from my template:
>mkdir ProjectName
>cd ProjectName
>dotnet new arro
>npm install
>dotnet run

For the nuget package will be considering to create once everything are satisfied

Sorry for my english :P