import { inject, injectable } from 'tsyringe';
import { ICacheRepository } from './implementations/cache-repository';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/containers/dependency-identifiers';
import { IETagCacheRepository, ISetETagCache } from './implementations/etag-cache-repository';

@injectable()
export class ETagCacheRepository implements IETagCacheRepository {
	constructor(@inject(DEPENDENCY_IDENTIFIERS.CACHE_REPOSITORY) private cacheRepository: ICacheRepository) {}

	async setCache({ key, payload, latest, ttl }: ISetETagCache) {
		const etag = `W/"${latest}"`;

		const toStore = {
			payload,
			etag,
		};

		await this.cacheRepository.set({
			key,
			value: toStore,
			ttl,
		});

		return { etag };
	}
}
