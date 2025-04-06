import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { authMiddleware } from '../middlewares/auth-middleware';
import { createUserSchema } from '../schemas/user/create-user-schema';
import { verifyUserPermissions } from '../middlewares/permission-middleware';
import { getUserProfileSchema } from '../schemas/user/get-user-profile-schema';
import { createUserController } from '../controllers/users/create-user-controller';
import { listingUserProductsSchema } from '../schemas/user/listing-user-products-schema';
import { getUserProfileController } from '../controllers/users/get-user-profile-controller';
import { listingUserProductsController } from '../controllers/users/listing-user-products-controller';

export async function usersRoutes(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post('/', { schema: createUserSchema }, createUserController);

	app
		.withTypeProvider<ZodTypeProvider>()
		.get('/me', { preHandler: authMiddleware, schema: getUserProfileSchema }, getUserProfileController);

	app
		.withTypeProvider<ZodTypeProvider>()
		.get(
			'/products',
			{ preHandler: [authMiddleware, verifyUserPermissions('Product', 'read')], schema: listingUserProductsSchema },
			listingUserProductsController
		);
}
