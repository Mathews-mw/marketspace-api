import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { rolesSchema } from '@/core/auth/roles';
import { paymentTypeSchema } from '@/domains/models/entities/payment-method';

const paramsSchema = z.object({
	userId: z.string().uuid(),
});

const querySchema = z.object({
	search: z.string().optional(),
	is_new: z.coerce.boolean().optional(),
	accept_trade: z.coerce.boolean().optional(),
	payment_types: z
		.array(paymentTypeSchema, {
			description: 'You can provider the following values: PIX, BOLETO, DEBITO, CREDITO, DINHEIRO or  DEPOSITO',
		})
		.optional(),
});

const responseSchema = z.object({
	amount: z.number(),
	products: z.array(
		z.object({
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
			paymentMethods: z.array(
				z.object({
					id: z.string().uuid(),
					type: paymentTypeSchema,
					label: z.string(),
					product_id: z.string().uuid(),
				})
			),
			user: z.object({
				id: z.string().uuid(),
				name: z.string(),
				email: z.string().email(),
				phone: z.string().nullable(),
				role: rolesSchema,
				avatar: z.string().url().nullable(),
				is_active: z.boolean(),
			}),
		})
	),
});

export type ListingProductsByUserParams = z.infer<typeof paramsSchema>;
export type ListingProductsByUserQuery = z.infer<typeof querySchema>;
export type ListingProductsByUserResponse = z.infer<typeof responseSchema>;

export const listingProductsByUserSchema: FastifySchema = {
	tags: ['Product'],
	summary: 'Listing products by user',
	security: [{ bearerAuth: [] }],
	params: paramsSchema,
	querystring: querySchema,
	response: {
		200: responseSchema,
	},
};
