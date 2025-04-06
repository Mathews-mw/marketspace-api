import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { ProductDetailsPresenter } from '../../presenters/product/product-details-presenter';
import { ListingUserProductsByUserUseCase } from '@/domains/application/features/products/use-cases/listing-products-by-user-use-case';
import {
	ListingProductsByUserParams,
	ListingProductsByUserQuery,
} from '../../schemas/product/listing-products-by-user-schema';

export async function listingProductsByUserController(request: FastifyRequest, reply: FastifyReply) {
	const { userId } = request.params as ListingProductsByUserParams;
	const { search, is_new, accept_trade, payment_types } = request.query as ListingProductsByUserQuery;

	const service = container.resolve(ListingUserProductsByUserUseCase);

	const result = await service.execute({
		userId,
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
		products: result.value.products.map(ProductDetailsPresenter.toHTTP),
	};

	return reply.status(200).send(response);
}
