import { FastifyInstance } from 'fastify';

import { authRoutes } from './auth-routes';
import { usersRoutes } from './users-routes';
import { productsRoutes } from './products-routes';
import { productImagesRoutes } from './product-images-routes';

export async function routes(app: FastifyInstance) {
	app.register(authRoutes, { prefix: '/auth' });

	app.register(usersRoutes, { prefix: '/users' });
	app.register(productsRoutes, { prefix: '/products' });
	app.register(productImagesRoutes, { prefix: '/product-images' });
}
