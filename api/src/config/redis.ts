import IORedis from 'ioredis';

const REDIS_HOST = process.env.REDIS_HOST as string;
const REDIS_PORT = process.env.REDIS_PORT as string;
const REDIS_PASS = process.env.REDIS_PASS as string;
const REDIS_DB = process.env.REDIS_DB as string;

export const redisConn = new IORedis({
  db: parseInt(REDIS_DB),
  host: REDIS_HOST,
  password: REDIS_PASS,
  port: parseInt(REDIS_PORT),
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});
