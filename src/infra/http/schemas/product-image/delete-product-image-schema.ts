import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

const paramsSchema = z.object({
	productImageId: z.string(),
});

const responseSchema = z.object({
	message: z.string(),
});

export type DeleteProductImageParams = z.infer<typeof paramsSchema>;
export type DeleteProductImageResponse = z.infer<typeof responseSchema>;

export const deleteProductImageSchema: FastifySchema = {
	tags: ['Product Image'],
	summary: 'Delete product image',
	security: [{ bearerAuth: [] }],
	params: paramsSchema,
	response: {
		200: responseSchema,
	},
};
