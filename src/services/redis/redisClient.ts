import { createClient, RedisClientType } from 'redis';

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);

let client: RedisClientType | null = null;

export const connectRedis = async (): Promise<RedisClientType> => {
  if (!client) {
    client = createClient({
      url: `redis://${redisHost}:${redisPort}`
    });

    client.on('error', (err) => {
      console.error('Redis error:', err);
    });

    await client.connect();
  }

  return client;
};

export const disconnectRedis = async (): Promise<void> => {
  if (client) {
    await client.disconnect();
    client = null;
  }
};

console.log('🔗 [Redis] Connecting to Redis...', process.env.REDIS_HOST, process.env.REDIS_PORT);
// Firct connection check 
connectRedis().then(() => {
  console.log('🔗 [Redis] Connected to Redis');
}).catch((err) => {
    console.error('Failed to connect to Redis:', err);
});
