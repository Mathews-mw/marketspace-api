import { z } from 'zod';
import { FastifyInstance } from 'fastify';

import { productController } from '../controllers/product-controller';

export async function productsRoutes(app: FastifyInstance) {
	app.post('/upload/:productId', productController);
}
