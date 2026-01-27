import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  //server: {
    //host: true,      // or "0.0.0.0"
    //port: 5173
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, "./cert/key.pem")),
    //   cert: fs.readFileSync(path.resolve(__dirname, "./cert/cert.pem")),
    // },
    // port: 5173,
    // host: "localhost",
    // headers: {
    //   "x-content-type-options": "nosniff",
    //   "x-xss-protection": "1; mode=block",
    //   "cache-control": "no-cache, no-store, max-age=0, must-revalidate",
    //   "x-frame-options": "DENY",
    //   "content-security-policy":
    //     "default-src 'self'; object-src https://megepayment.gov.in; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' ws: wss: http://10.179.13.183:8084; frame-src 'self'; style-src 'self' 'unsafe-inline';",
    //   "referrer-policy": "strict-origin-when-cross-origin",
    // },
  //},
});
