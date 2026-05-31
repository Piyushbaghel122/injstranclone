import dotenv from "dotenv";
import Redis from "ioredis";

dotenv.config({ path: new URL("../../.env", import.meta.url), override: true });

const redisConnectionOptions = {
  lazyConnect: true,
  maxRetriesPerRequest: 1,
  retryStrategy: null,
};

const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL, redisConnectionOptions)
  : new Redis({
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT || 6379),
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      db: Number(process.env.REDIS_DB || 0),
      ...redisConnectionOptions,
    });

redis.on("connect", () => {
  console.log("Connected to Redis");
});

redis.on("error", (error) => {
  console.error("Redis error:", error.message);
});

export default redis;
