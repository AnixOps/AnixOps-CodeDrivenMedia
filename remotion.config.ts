/**
 * Remotion configuration file
 * See https://www.remotion.dev/docs/config for more information
 */

import { Config } from "@remotion/cli/config";

// Basic configuration
Config.setVideoImageFormat("jpeg");
Config.setPixelFormat("yuv420p");
Config.setCodec("h264");

// Set concurrency based on environment
if (process.env.ENABLE_CUDA === "true") {
  Config.setConcurrency(parseInt(process.env.REMOTION_CONCURRENCY || "4"));
  console.log("CUDA mode: High concurrency rendering");
} else {
  Config.setConcurrency(2);
}

// Environment specific configuration
if (process.env.NODE_ENV === "development") {
  Config.setCrf(28);
  Config.setScale(0.5);
} else if (process.env.NODE_ENV === "production") {
  Config.setCrf(18);
  Config.setScale(1);
}
