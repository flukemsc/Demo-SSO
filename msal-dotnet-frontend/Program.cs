using Microsoft.Identity.Web;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.Identity.Web.UI;
using Microsoft.AspNetCore.Rewrite;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.


builder.Services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
                 .AddMicrosoftIdentityWebApp(builder.Configuration.GetSection("AzureAd"));

builder.Services.Configure<OpenIdConnectOptions>(OpenIdConnectDefaults.AuthenticationScheme, options =>
{
    options.Events.OnSignedOutCallbackRedirect = context =>
    {
        context.Response.Redirect("/"); // หน้า redirect หลัง sign out
        context.HandleResponse();
        return Task.CompletedTask;
    };
});


builder.Services.AddRazorPages()
                .AddMicrosoftIdentityUI();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();
app.UseRewriter(
    new RewriteOptions().Add(
        context => {
            if (context.HttpContext.Request.Path == "/MicrosoftIdentity/Account/SignedOut")
            { context.HttpContext.Response.Redirect("/login"); }
        })
);

app.MapRazorPages();
app.MapControllers();


app.Run();

