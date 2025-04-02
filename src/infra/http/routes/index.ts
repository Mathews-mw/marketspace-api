import { FastifyInstance } from 'fastify';
import { productsRoutes } from './products.routes';
import { usersRoutes } from './users.routes';

export async function routes(app: FastifyInstance) {
	app.register(usersRoutes, { prefix: '/users' });
	app.register(productsRoutes, { prefix: '/products' });
}
