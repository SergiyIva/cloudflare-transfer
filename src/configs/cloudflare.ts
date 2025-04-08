import Cloudflare from "cloudflare";
import config from "./config.ts";

export const cf = new Cloudflare({
  apiToken: config.CLOUDFLARE_TOKEN,
});
