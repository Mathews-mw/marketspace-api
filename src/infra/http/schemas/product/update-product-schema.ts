import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { paymentTypeSchema } from '@/domains/models/entities/payment-method';

const paramsSchema = z.object({
	productId: z.string(),
});

const bodySchema = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
	is_new: z.coerce.boolean().optional(),
	is_active: z.coerce.boolean().optional(),
	price: z.coerce.number().optional(),
	accept_trade: z.coerce.boolean().optional(),
	payment_types: z.array(paymentTypeSchema).optional(),
});

const responseSchema = z.object({
	message: z.string(),
	product_id: z.string().uuid(),
});

export type UpdateProductParams = z.infer<typeof paramsSchema>;
export type UpdateProductRequest = z.infer<typeof bodySchema>;
export type UpdateProductResponse = z.infer<typeof responseSchema>;

export const updateProductSchema: FastifySchema = {
	tags: ['Product'],
	summary: 'Update product',
	security: [{ bearerAuth: [] }],
	params: paramsSchema,
	body: bodySchema,
	response: {
		200: responseSchema,
	},
};
