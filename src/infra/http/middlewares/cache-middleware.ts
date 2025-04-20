import { container } from 'tsyringe';
import fastifyPlugin from 'fastify-plugin';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { makeCacheKey } from '@/infra/cache/make-cache-key';
import { RedisCacheRepository } from '@/infra/cache/redis-cache-repository';

interface ICacheOpts {
	/** Prefixo de rota para gerar a chave */
	route: string;
	/** Parâmetros de req.query e/ou req.params a considerar na chave */
	pickParams?: (req: FastifyRequest) => Record<string, any>;
	/** Tempo de vida em segundos no Redis */
	ttl?: number;
}

interface IHitCache {
	payload: Object;
	etag: string;
}

export const cachePlugin = fastifyPlugin(async (app: FastifyInstance) => {
	app.decorate('cachePreHandler', (opts: ICacheOpts) => {
		return async (request: FastifyRequest, reply: FastifyReply) => {
			const cacheRepository = container.resolve(RedisCacheRepository);

			const params = opts.pickParams
				? opts.pickParams(request)
				: { ...(request.query as Record<string, any>), ...(request.params as Record<string, any>) };

			const key = makeCacheKey(opts.route, params);
			const hitCache = await cacheRepository.get<IHitCache>(key);

			if (!hitCache) return;

			// Se ETag bate, responde só o 304
			const ifNone = request.headers['if-none-match'];
			reply.header('Cache-Control', 'public, max-age=' + (opts.ttl ?? 60) + ', must-revalidate');

			if (ifNone === hitCache.etag) {
				return reply.code(304).send();
			}

			// Senão retorna o payload em cache
			return reply.code(200).send(hitCache.payload);
		};
	});
});
