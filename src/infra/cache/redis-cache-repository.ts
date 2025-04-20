import Redis from 'ioredis';

import { env } from '@/env';
import { ICacheRepository, ISetCache } from './implementations/cache-repository';

export class RedisCacheRepository implements ICacheRepository {
	private redis: Redis;

	constructor() {
		this.redis = new Redis({
			host: env.REDIS_HOST,
			port: env.REDIS_PORT,
		});
	}

	async set({ key, value, ttl }: ISetCache): Promise<void> {
		const toStore = JSON.stringify(value);
		await this.redis.set(key, toStore, 'EX', ttl ?? 60 * 5);
	}

	async get<T>(key: string): Promise<T | null> {
		const cache = await this.redis.get(key);

		if (!cache) {
			return null;
		}

		return JSON.parse(cache);
	}

	async delete(key: string): Promise<void> {
		await this.delete(key);
	}
}
