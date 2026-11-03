import type { NextConfig } from "next";

// Extraer dinámicamente protocolo, host y puerto del CMS desde variable de entorno
const cmsUrl = process.env.CMS_API_URL || process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:8000";
let dynamicCmsHost = "localhost";
let dynamicCmsProtocol: "http" | "https" = "http";
let dynamicCmsPort: string | undefined = "8000";

try {
  const parsed = new URL(cmsUrl);
  dynamicCmsHost = parsed.hostname;
  dynamicCmsProtocol = parsed.protocol.replace(":", "") as "http" | "https";
  dynamicCmsPort = parsed.port || (dynamicCmsProtocol === "https" ? undefined : "80");
} catch {
  // Mantener valores por defecto si la URL no es válida
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Dominio dinámico configurado por variable de entorno (Desarrollo o Producción)
      {
        protocol: dynamicCmsProtocol,
        hostname: dynamicCmsHost,
        ...(dynamicCmsPort ? { port: dynamicCmsPort } : {}),
      },
      // Localhost / 127.0.0.1 para desarrollo local
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      // Servicios CDN y almacenamiento de medios en producción
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.cloudflare.com",
      },
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "**.railway.app",
      },
      {
        protocol: "https",
        hostname: "**.up.railway.app",
      },
    ],
  },
};

export default nextConfig;
