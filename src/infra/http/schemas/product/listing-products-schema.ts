import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

import { paymentTypeSchema } from '@/domains/models/entities/payment-method';

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
		})
	),
});

export type ListingProductsQuery = z.infer<typeof querySchema>;
export type ListingProductsResponse = z.infer<typeof responseSchema>;

export const listingProductsSchema: FastifySchema = {
	tags: ['Product'],
	summary: 'Listing products',
	security: [{ bearerAuth: [] }],
	querystring: querySchema,
	response: {
		200: responseSchema,
	},
};
