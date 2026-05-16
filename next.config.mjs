/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Export estático: `next build` gera a pasta `out/` (site 100% estático).
  output: 'export',
  // Cada rota vira <rota>/index.html — servido de forma limpa em hosts estáticos.
  trailingSlash: true,
  // next/image sem servidor de otimização.
  images: { unoptimized: true },
};

export default nextConfig;
