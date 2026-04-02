const dotenv = require("dotenv");
const path = require("path");

// load android/.env or root .env
const envPath = path.resolve(__dirname, "android", ".env");
dotenv.config({ path: envPath });
if (!process.env.API_KEY && !process.env.api_key) {
  dotenv.config();
}

export default ({ config }) => ({
  ...config,
  extra: {
    ...(config.extra || {}),
    apiKey: process.env.API_KEY || process.env.api_key || "",
  },
});
