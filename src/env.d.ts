declare module 'cloudflare:workers' {
  /** Worker bindings and secrets from wrangler.toml / the Cloudflare dashboard (PROPERTIES_KV, ADMIN_PASSWORD). */
  export const env: Record<string, unknown>;
}
