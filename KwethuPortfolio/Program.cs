using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var site = new PhysicalFileProvider(
    Path.GetFullPath(Path.Combine(builder.Environment.ContentRootPath, "..", "docs")));

app.UseDefaultFiles(new DefaultFilesOptions { FileProvider = site });
app.UseStaticFiles(new StaticFileOptions { FileProvider = site });

app.Run();
