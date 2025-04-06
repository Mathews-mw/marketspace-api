import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { UpdateProductParams, UpdateProductRequest } from '../../schemas/product/update-product-schema';
import { UpdateProductUseCase } from '@/domains/application/features/products/use-cases/update-product-use-case';

export async function updateProductController(request: FastifyRequest, reply: FastifyReply) {
	const { productId } = request.params as UpdateProductParams;
	const { name, description, price, is_new, is_active, accept_trade, payment_types } =
		request.body as UpdateProductRequest;

	const { sub } = request.user;

	const service = container.resolve(UpdateProductUseCase);

	const result = await service.execute({
		productId: productId,
		userId: sub,
		name,
		description,
		isNew: is_new,
		price,
		isActive: is_active,
		acceptTrade: accept_trade,
		paymentTypes: payment_types,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply
		.status(200)
		.send({ message: 'Product updated successfully', product_id: result.value.product.id.toString() });
}
