import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { GetProductDetailsParams } from '../../schemas/product/get-product-details-schema';
import { ProductDetailsPresenter } from '../../presenters/product/product-details-presenter';
import { GetProductDetailsUseCase } from '@/domains/application/features/products/use-cases/get-product-details-use-case';

export async function getProductDetailsController(request: FastifyRequest, reply: FastifyReply) {
	const { productId } = request.params as GetProductDetailsParams;

	const service = container.resolve(GetProductDetailsUseCase);

	const result = await service.execute({
		productId: productId,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(200).send(ProductDetailsPresenter.toHTTP(result.value.product));
}
