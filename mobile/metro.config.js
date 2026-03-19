const path = require("path");

// Expo/Metro by default only watches within the project root (`mobile/`).
// Your Learn card images live in the repo-root `images/` folder, so we must
// explicitly add it to `watchFolders` for bundling to succeed on web.
const { getDefaultConfig } = require("@expo/metro-config");

const config = getDefaultConfig(__dirname);

const repoRootImages = path.resolve(__dirname, "..", "images");
config.watchFolders = Array.from(
  new Set([...(config.watchFolders ?? []), repoRootImages])
);

module.exports = config;

