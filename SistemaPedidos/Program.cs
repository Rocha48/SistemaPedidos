using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using sistemapedidos.Business.Services;
using sistemapedidos.Data;
using sistemapedidos.Helpers;
using sistemapedidos.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ========================================
// CONFIGURACIÓN DE LA BASE DE DATOS
// ========================================
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// ========================================
// CONFIGURACIÓN DE APP SETTINGS (JWT)
// ========================================
builder.Services.Configure<AppSettings>(builder.Configuration.GetSection("AppSettings"));

// ========================================
// INYECCIÓN DE SERVICIOS
// ========================================
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<CategoriaService>();
builder.Services.AddScoped<MesaService>();
builder.Services.AddScoped<PagoService>();
builder.Services.AddScoped<PlatoService>();
builder.Services.AddScoped<PedidoService>();
builder.Services.AddScoped<DetallePedidoService>();
builder.Services.AddScoped<UsuarioService>();
builder.Services.AddScoped<RolService>();

// ========================================
// CONFIGURAR AUTENTICACIÓN JWT
// ========================================
var appSettings = builder.Configuration.GetSection("AppSettings").Get<AppSettings>();
var key = Encoding.UTF8.GetBytes(appSettings.JwtSecret);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine("Authentication failed: " + context.Exception.Message);
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            Console.WriteLine("Token validated successfully");
            return Task.CompletedTask;
        }
    };

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = appSettings.JwtIssuer,
        ValidAudience = appSettings.JwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

builder.Services.AddAuthorization();

// ========================================
// CONFIGURACIÓN DE SERVICIOS PARA LA API
// ========================================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "SistemaPedidos API",
        Version = "v1",
        Description = "API para gestión de pedidos de restaurante"
    });

    // Definir el esquema de seguridad Bearer JWT
    var securityScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "Ingrese 'Bearer' seguido de un espacio y luego el token JWT.\n\nEjemplo: Bearer eyJhbGc...",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Reference = new OpenApiReference
        {
            Type = ReferenceType.SecurityScheme,
            Id = "Bearer"
        }
    };

    c.AddSecurityDefinition("Bearer", securityScheme);

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
});

// ========================================
// CONSTRUIR APLICACIÓN
// ========================================
var app = builder.Build();

// ========================================
// PIPELINE HTTP
// ========================================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "SistemaPedidos API v1");
    });
}

app.UseHttpsRedirection();

// IMPORTANTE: El orden es crucial
app.UseAuthentication();  // Primero autenticación
app.UseAuthorization();   // Luego autorización

app.MapControllers();

app.Run();