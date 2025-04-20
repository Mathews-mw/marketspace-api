import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { ProductInfoPresenter } from '../../presenters/product/product-info-presenter';
import { ListingProductsCursorModeQuery } from '../../schemas/product/listing-products-cursor-mode-schema';
import { ListingProductsCursorModeUseCase } from '@/domains/application/features/products/use-cases/listing-products-cursor-mode-use-case';

export async function listingProductsCursorModeController(request: FastifyRequest, reply: FastifyReply) {
	const { limit, cursor, skip, search, is_new, accept_trade, payment_types } =
		request.query as ListingProductsCursorModeQuery;

	const service = container.resolve(ListingProductsCursorModeUseCase);

	const result = await service.execute({
		limit,
		cursor,
		skip,
		search,
		isNew: is_new,
		acceptTrade: accept_trade,
		paymentMethods: payment_types,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	const response = {
		next_cursor: result.value.nextCursor ?? null,
		previous_cursor: result.value.previousCursor ?? null,
		still_have_data: result.value.stillHaveData,
		products: result.value.products.map(ProductInfoPresenter.toHTTP),
	};

	return reply.status(200).send(response);
}
