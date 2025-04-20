import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { makeCacheKey } from '@/infra/cache/make-cache-key';
import { ETagCacheRepository } from '@/infra/cache/etag-cache-repository';
import { GetProductDetailsParams } from '../../schemas/product/get-product-details-schema';
import { ProductDetailsPresenter } from '../../presenters/product/product-details-presenter';
import { GetProductDetailsUseCase } from '@/domains/application/features/products/use-cases/get-product-details-use-case';

export async function getProductDetailsController(request: FastifyRequest, reply: FastifyReply) {
	const { productId } = request.params as GetProductDetailsParams;

	const service = container.resolve(GetProductDetailsUseCase);
	const cacheService = container.resolve(ETagCacheRepository);

	const result = await service.execute({
		productId: productId,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	const { product } = result.value;

	const latest = product.updatedAt?.getTime() ?? product.createdAt.getTime();

	const key = makeCacheKey('/api/products/:productId/details', { productId });

	const { etag } = await cacheService.setCache({ key, latest, payload: product, ttl: 60 * 15 });

	const maxAge = 60 * 15; // 15 min => A resposta pode ser considerada “fresca” por 15 minutos a partir do momento em que foi recebida.
	const staleWhileRevalidate = 60; // 60 sec =>  Servir imediatamente a versão em cache (mesmo “vencida”) enquanto busca uma atualização em background

	reply.header('ETag', etag);
	reply.header(
		'Cache-Control',
		`public, max-age=${maxAge}, must-revalidate, stale-while-revalidate=${staleWhileRevalidate}`
	);
	return reply.status(200).send(ProductDetailsPresenter.toHTTP(product));
}
