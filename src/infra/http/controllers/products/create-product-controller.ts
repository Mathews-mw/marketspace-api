import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { CreateProductRequest } from '../../schemas/product/create-product-schema';
import { CreateProductUseCase } from '@/domains/application/features/products/use-cases/create-product-use-case';

export async function createProductController(request: FastifyRequest, reply: FastifyReply) {
	const { name, description, price, is_new, accept_trade, payment_types } = request.body as CreateProductRequest;

	const { sub } = request.user;

	const service = container.resolve(CreateProductUseCase);

	const result = await service.execute({
		userId: sub,
		name,
		description,
		isNew: is_new,
		price,
		acceptTrade: accept_trade,
		paymentTypes: payment_types,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply
		.status(201)
		.send({ message: 'Product created successfully', product_id: result.value.product.id.toString() });
}
