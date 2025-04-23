import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { DeleteProductParams } from '../../schemas/product/delete-product-schema';
import { DeleteProductUseCase } from '@/domains/application/features/products/use-cases/delete-product-use-case';

export async function deleteProductController(request: FastifyRequest, reply: FastifyReply) {
	const { productId } = request.params as DeleteProductParams;

	console.log('product id to delete: ', productId);

	const { sub } = request.user;

	const service = container.resolve(DeleteProductUseCase);

	const result = await service.execute({
		productId,
		userId: sub,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(200).send({ message: 'Product deleted successfully' });
}
