import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { DeleteProductImageParams } from '../../schemas/product-image/delete-product-image-schema';
import { DeleteProductImageUseCase } from '@/domains/application/features/product-images/use-cases/delete-product-image-use-case';

export async function deleteProductImageController(request: FastifyRequest, reply: FastifyReply) {
	const { productImageId } = request.params as DeleteProductImageParams;

	const service = container.resolve(DeleteProductImageUseCase);

	const result = await service.execute({
		productImageId,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(200).send({ message: 'Image deleted successfully' });
}
