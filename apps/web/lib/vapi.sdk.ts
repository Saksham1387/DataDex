import Vapi from "@vapi-ai/web";
import { envConfig } from "../app/types/env.config";

export const vapi = new Vapi(envConfig.vapi.token);