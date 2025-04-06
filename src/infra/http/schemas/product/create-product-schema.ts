import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { paymentTypeSchema } from '@/domains/models/entities/payment-method';

const bodySchema = z.object({
	name: z.string(),
	description: z.string(),
	is_new: z.coerce.boolean(),
	price: z.coerce.number(),
	accept_trade: z.coerce.boolean(),
	payment_types: z.array(paymentTypeSchema),
});

const responseSchema = z.object({
	message: z.string(),
	product_id: z.string().uuid(),
});

export type CreateProductRequest = z.infer<typeof bodySchema>;
export type CreateProductResponse = z.infer<typeof responseSchema>;

export const createProductSchema: FastifySchema = {
	tags: ['Product'],
	summary: 'Create a new product',
	security: [{ bearerAuth: [] }],
	body: bodySchema,
	response: {
		201: responseSchema,
	},
};
