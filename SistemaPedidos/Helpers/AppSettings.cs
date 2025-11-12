namespace sistemapedidos.Helpers
{
    public class AppSettings
    {
        public string JwtSecret { get; set; }
        public int JwtExpireMinutes { get; set; }
        public string JwtIssuer { get; set; }
        public string JwtAudience { get; set; }
    }
}
