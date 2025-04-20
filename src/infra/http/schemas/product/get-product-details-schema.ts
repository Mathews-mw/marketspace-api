import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { rolesSchema } from '@/core/auth/roles';
import { paymentTypeSchema } from '@/domains/models/entities/payment-method';

const paramsSchema = z.object({
	productId: z.string(),
});

const responseSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	description: z.string(),
	price: z.number(),
	is_new: z.boolean(),
	accept_trade: z.boolean(),
	user_id: z.string(),
	is_active: z.boolean(),
	created_at: z.date(),
	updated_at: z.date().nullable(),
	images: z.array(
		z.object({
			id: z.string().uuid(),
			product_id: z.string().uuid(),
			file_name: z.string(),
			unique_name: z.string(),
			url: z.string().url(),
		})
	),
	payment_methods: z.array(
		z.object({
			id: z.string().uuid(),
			type: paymentTypeSchema,
			label: z.string(),
			product_id: z.string().uuid(),
		})
	),
	owner: z.object({
		id: z.string().uuid(),
		name: z.string(),
		email: z.string().email(),
		phone: z.string().nullable(),
		role: rolesSchema,
		avatar: z.string().url().nullable(),
		is_active: z.boolean(),
		created_at: z.date(),
	}),
});

export type GetProductDetailsParams = z.infer<typeof paramsSchema>;
export type GetProductDetailsResponse = z.infer<typeof responseSchema>;

export const getProductDetailsSchema: FastifySchema = {
	tags: ['Product'],
	summary: 'Get product details by id',
	security: [{ bearerAuth: [] }],
	params: paramsSchema,
	response: {
		200: responseSchema,
	},
};
