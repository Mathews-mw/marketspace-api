import z from 'zod';
import { FastifySchema } from 'fastify/types/schema';

const bodySchema = z.object({
	name: z.string(),
	email: z.string().email(),
	password: z.string(),
	phone: z.string(),
});

const responseSchema = z.object({
	message: z.string(),
	user_id: z.string().uuid(),
});

export type CreateUserRequest = z.infer<typeof bodySchema>;
export type CreateUserResponse = z.infer<typeof responseSchema>;

export const createUserSchema: FastifySchema = {
	tags: ['Users'],
	summary: 'Create a new user',
	security: [{ bearerAuth: [] }],
	body: bodySchema,
	response: {
		201: responseSchema,
	},
};
