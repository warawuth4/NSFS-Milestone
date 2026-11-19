import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisStatusDto } from './dto/redis-status.dto';

interface MemoryCacheEntry {
  value: string;
  expiresAt: number | null;
}

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private isConnected = false;
  private readonly memoryStore = new Map<string, MemoryCacheEntry>();
  private redisUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.redisUrl =
      this.configService.get<string>('REDIS_URL') ||
      process.env.REDIS_URL ||
      'redis://localhost:6379';
  }

  async onModuleInit() {
    await this.initClient();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async initClient(): Promise<void> {
    // If running in test mode without an explicit REDIS_URL, use fast in-memory fallback
    if (process.env.NODE_ENV === 'test' && !process.env.REDIS_URL) {
      this.logger.log('Test environment detected without REDIS_URL. Initialized in-memory fallback cache.');
      return;
    }

    try {
      this.logger.log(`Attempting connection to Redis at ${this.maskUrl(this.redisUrl)}...`);
      this.client = new Redis(this.redisUrl, {
        lazyConnect: true,
        maxRetriesPerRequest: 1,
        enableOfflineQueue: false,
        connectTimeout: 2000,
        retryStrategy: (times) => {
          if (times > 3) {
            this.logger.warn(
              `Redis retry limit reached (${times}). Falling back to resilient in-memory caching.`,
            );
            return null; // Stop retrying
          }
          return Math.min(times * 300, 1500);
        },
      });

      this.client.on('connect', () => {
        this.isConnected = true;
        this.logger.log('Redis connected successfully. Cache active.');
      });

      this.client.on('ready', () => {
        this.isConnected = true;
      });

      this.client.on('error', (err) => {
        this.isConnected = false;
        this.logger.warn(`Redis connection error: ${err.message}. Resilient in-memory fallback active.`);
      });

      this.client.on('close', () => {
        this.isConnected = false;
        this.logger.warn('Redis connection closed.');
      });

      // Attempt initial connect asynchronously with short timeout
      await this.client.connect().catch((err) => {
        this.isConnected = false;
        this.logger.warn(
          `Initial Redis connection failed: ${err.message}. Operating in resilient in-memory mode.`,
        );
      });
    } catch (error: any) {
      this.isConnected = false;
      this.logger.warn(
        `Failed to initialize Redis client: ${error?.message || error}. Using in-memory cache.`,
      );
    }
  }

  private async disconnect(): Promise<void> {
    if (this.client) {
      this.logger.log('Disconnecting Redis client...');
      try {
        await this.client.quit();
      } catch {
        this.client.disconnect();
      }
      this.client = null;
      this.isConnected = false;
    }
  }

  /**
   * Retrieve cached value by key
   */
  async get<T>(key: string): Promise<T | null> {
    if (this.isConnected && this.client) {
      try {
        const raw = await this.client.get(key);
        if (raw !== null) {
          this.logger.debug(`[Redis HIT] Key: ${key}`);
          return JSON.parse(raw) as T;
        }
        this.logger.debug(`[Redis MISS] Key: ${key}`);
        return null;
      } catch (err: any) {
        this.logger.warn(`Redis GET failed for key "${key}": ${err.message}. Checking memory fallback.`);
      }
    }

    // In-memory fallback
    const entry = this.memoryStore.get(key);
    if (!entry) {
      return null;
    }

    if (entry.expiresAt !== null && Date.now() > entry.expiresAt) {
      this.memoryStore.delete(key);
      return null;
    }

    try {
      return JSON.parse(entry.value) as T;
    } catch {
      return null;
    }
  }

  /**
   * Set cached value by key with optional TTL in seconds (default 60s)
   */
  async set(key: string, value: any, ttlSeconds: number = 60): Promise<void> {
    const serialized = JSON.stringify(value);

    // Save in memory fallback
    const expiresAt = ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : null;
    this.memoryStore.set(key, { value: serialized, expiresAt });

    if (this.isConnected && this.client) {
      try {
        if (ttlSeconds > 0) {
          await this.client.set(key, serialized, 'EX', ttlSeconds);
        } else {
          await this.client.set(key, serialized);
        }
        this.logger.debug(`[Redis SET] Key: ${key} (TTL: ${ttlSeconds}s)`);
      } catch (err: any) {
        this.logger.warn(`Redis SET failed for key "${key}": ${err.message}`);
      }
    }
  }

  /**
   * Delete a single key from cache
   */
  async del(key: string): Promise<void> {
    this.memoryStore.delete(key);

    if (this.isConnected && this.client) {
      try {
        await this.client.del(key);
        this.logger.debug(`[Redis DEL] Key: ${key}`);
      } catch (err: any) {
        this.logger.warn(`Redis DEL failed for key "${key}": ${err.message}`);
      }
    }
  }

  /**
   * Invalidate all keys matching a wildcard pattern (e.g., "milestones:*")
   */
  async delByPattern(pattern: string): Promise<void> {
    // Invalidate from memory store
    const regex = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`);
    for (const k of this.memoryStore.keys()) {
      if (regex.test(k)) {
        this.memoryStore.delete(k);
      }
    }

    if (this.isConnected && this.client) {
      try {
        const keys = await this.client.keys(pattern);
        if (keys.length > 0) {
          await this.client.del(...keys);
          this.logger.log(`[Redis INVALIDATE] Pattern: "${pattern}" removed ${keys.length} keys.`);
        }
      } catch (err: any) {
        this.logger.warn(`Redis delByPattern failed for pattern "${pattern}": ${err.message}`);
      }
    }
  }

  /**
   * Clear all cached keys
   */
  async flushAll(): Promise<void> {
    this.memoryStore.clear();

    if (this.isConnected && this.client) {
      try {
        await this.client.flushdb();
        this.logger.log('[Redis FLUSH] Cache database flushed successfully.');
      } catch (err: any) {
        this.logger.warn(`Redis FLUSH failed: ${err.message}`);
      }
    }
  }

  /**
   * Get current cache health & status
   */
  async getStatus(): Promise<RedisStatusDto> {
    let keyCount = this.memoryStore.size;

    if (this.isConnected && this.client) {
      try {
        const dbSize = await this.client.dbsize();
        keyCount = dbSize;
      } catch {
        // Fall back to memoryStore size
      }
    }

    return {
      status: this.isConnected ? 'connected' : 'fallback_memory',
      provider: this.isConnected ? 'redis' : 'memory',
      url: this.maskUrl(this.redisUrl),
      keyCount,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Mask credentials in redis URL for safe logging/display
   */
  private maskUrl(url: string): string {
    try {
      const parsed = new URL(url);
      if (parsed.password) {
        parsed.password = '***';
      }
      return parsed.toString();
    } catch {
      return url.replace(/:\/\/.*@/, '://***@');
    }
  }
}
