import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { createUserSchema } from '../schemas/create-user-schema';
import { createUserController } from '../controllers/users/create-user-controller';

export async function usersRoutes(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post('/', { schema: createUserSchema }, createUserController);

	// app
	// 	.withTypeProvider<ZodTypeProvider>()
	// 	.get('/me', { preHandler: authMiddleware, schema: getUserProfileSchema }, getUserProfileController);
}
