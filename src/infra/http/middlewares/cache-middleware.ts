import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { makeCacheKey } from '@/infra/cache/make-cache-key';
import { RedisCacheRepository } from '@/infra/cache/redis-cache-repository';

export interface CacheOptions {
	route: string;
	pickParams?: (req: FastifyRequest) => Record<string, any>;
	ttl?: number;
}

interface IHitCache {
	payload: Object;
	etag: string;
}

/**
 * Retorna um preHandler que:
 * 1) Tenta responder do Redis (304 ou 200+payload)
 * 2) Senão, delega ao handler principal
 * @param route - Prefixo de rota para gerar a chave;
 * @param pickParams - Extrai do request os parâmetros que entram na chave;
 * @param ttl - TTL em segundos no Redis;
 */
export function cachePreHandler(opts: CacheOptions): (request: FastifyRequest, reply: FastifyReply) => Promise<void> {
	const cacheRepository = container.resolve(RedisCacheRepository);

	console.log('cache pre handler: ', opts);

	return async (request, reply) => {
		const params = opts.pickParams
			? opts.pickParams(request)
			: {
					...(request.query as Record<string, any>),
					...(request.params as Record<string, any>),
				};

		const key = makeCacheKey(opts.route, params);
		const hitCache = await cacheRepository.get<IHitCache>(key);

		if (!hitCache) {
			// não há cache: deixa o handler principal executar
			return;
		}

		// existe cache: valida ETag
		const incoming = request.headers['if-none-match'];
		reply.header('ETag', hitCache.etag);
		reply.header('Cache-Control', `public, max-age=${opts.ttl ?? 60}, must-revalidate`);

		if (incoming === hitCache.etag) {
			// Se ETag bate, responde só o 304
			return reply.status(304).send();
		}

		// Senão retorna o payload em cache
		return reply.status(200).send(hitCache.payload);
	};
}
