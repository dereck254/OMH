var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Serve static files (like index.html)
app.UseDefaultFiles(); // Looks for index.html by default
app.UseStaticFiles();

app.Run();
