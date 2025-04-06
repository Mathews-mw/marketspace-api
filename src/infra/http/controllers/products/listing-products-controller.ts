import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { ListingProductsQuery } from '../../schemas/product/listing-products-schema';
import { ProductInfoPresenter } from '../../presenters/product/product-info-presenter';
import { ListingProductsUseCase } from '@/domains/application/features/products/use-cases/listing-products-use-case';

export async function listingProductsController(request: FastifyRequest, reply: FastifyReply) {
	const { search, is_new, accept_trade, payment_types } = request.query as ListingProductsQuery;

	const service = container.resolve(ListingProductsUseCase);

	const result = await service.execute({
		search,
		isNew: is_new,
		acceptTrade: accept_trade,
		paymentMethods: payment_types,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	const response = {
		amount: result.value.amount,
		products: result.value.products.map(ProductInfoPresenter.toHTTP),
	};

	return reply.status(200).send(response);
}
