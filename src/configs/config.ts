import { number, object, optional, string } from "valibot";
import { getConfig } from "@sergiyiva/env-validate";

const ConfigSchema = object({
  PORT: optional(number(), 5000),
  CLOUDFLARE_TOKEN: string(),
  DEFAULT_ACCOUNT_ID: string(),
  DEFAULT_ACCOUNT_NAME: string(),
});

export default getConfig(ConfigSchema);
