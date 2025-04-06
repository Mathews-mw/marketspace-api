import { z } from 'zod';
import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { UploadProductImageUseCase } from '@/domains/application/features/product-images/use-cases/upload-product-images-use-case';

const paramsSchema = z.object({
	productId: z.string(),
});

export async function uploadProductImagesController(request: FastifyRequest, reply: FastifyReply) {
	const { productId } = paramsSchema.parse(request.params);

	const parts = request.files();

	const service = container.resolve(UploadProductImageUseCase);

	for await (const part of parts) {
		const result = await service.execute({
			productId,
			fileStream: part.file,
			fileName: part.filename,
			contentType: part.mimetype,
		});

		if (result.isFalse()) {
			throw result.value;
		}
	}

	return reply.status(200).send({ message: 'Image upload successful' });
}
