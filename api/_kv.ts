import { createClient } from "@vercel/kv";

export const kv = createClient({
  url:
    process.env.KV_REST_API_URL || "https://legal-mastodon-210701.upstash.io",
  token:
    process.env.KV_REST_API_TOKEN ||
    "gQAAAAAAAzcNAAIgcDEyODhiYmQzMDk1Mzc0YjViYmVjNzc0YzBhZTFjYzQzOA",
});
