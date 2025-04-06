import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

const paramsSchema = z.object({
	productId: z.string(),
});

const responseSchema = z.object({
	message: z.string(),
});

export type DeleteProductParams = z.infer<typeof paramsSchema>;
export type DeleteProductResponse = z.infer<typeof responseSchema>;

export const deleteProductSchema: FastifySchema = {
	tags: ['Product'],
	summary: 'Delete product',
	security: [{ bearerAuth: [] }],
	params: paramsSchema,
	response: {
		200: responseSchema,
	},
};
