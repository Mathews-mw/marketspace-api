import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { authMiddleware } from '../middlewares/auth-middleware';
import { verifyUserPermissions } from '../middlewares/permission-middleware';
import { deleteProductImageSchema } from '../schemas/product-image/delete-product-image-schema';
import { uploadProductImagesController } from '../controllers/product-images/upload-product-images-controller';
import { deleteProductImageController } from '../controllers/product-images/delete-product-image-controller';

export async function productImagesRoutes(app: FastifyInstance) {
	app.post(
		'/:productId',
		{ preHandler: [authMiddleware, verifyUserPermissions('ProductImage', 'create')], schema: { hide: true } },
		uploadProductImagesController
	);

	app.withTypeProvider<ZodTypeProvider>().delete(
		'/:productImageId',
		{
			preHandler: [authMiddleware, verifyUserPermissions('ProductImage', 'delete')],
			schema: deleteProductImageSchema,
		},
		deleteProductImageController
	);
}
