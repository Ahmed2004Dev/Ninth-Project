import {resolve} from "node:path";
import { config } from "dotenv";

export const NODE_ENV = process.env.NODE_ENV;

const eventPath = {
    development : ".env.dev",
    production : ".env.prod",
}

config({path:resolve(`./config/${eventPath[NODE_ENV]}`)});

export const URI = process.env.URI;
export const PORT = process.env.PORT;
export const SECRETKEY = process.env.SECRETKEY;
export const JWT = process.env.JWT;