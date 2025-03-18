import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  disable: false,
});

export default withPWA({
  output: "export",
  distDir: "./dist",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  productionBrowserSourceMaps: true, 
});