import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { UserPresenter } from '../../presenters/user/user-presenter';
import { ProductInfoPresenter } from '../../presenters/product/product-info-presenter';
import { ListingUserProductsQuery } from '../../schemas/user/listing-user-products-schema';
import { ListingUserProductsUseCase } from '@/domains/application/features/users/use-cases/listing-user-products-use-case';

export async function listingUserProductsController(request: FastifyRequest, reply: FastifyReply) {
	const { search, is_new, accept_trade, payment_types } = request.query as ListingUserProductsQuery;

	const { sub } = request.user;

	const service = container.resolve(ListingUserProductsUseCase);

	const result = await service.execute({
		userId: sub,
		search,
		isNew: is_new,
		acceptTrade: accept_trade,
		paymentMethods: payment_types,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	const { user, productsArgs } = result.value;

	const response = {
		user: UserPresenter.toHTTP(user),
		product_args: {
			amount: productsArgs.amount,
			products: productsArgs.products.map(ProductInfoPresenter.toHTTP),
		},
	};

	return reply.status(200).send(response);
}
