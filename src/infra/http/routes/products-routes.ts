import { FastifyInstance } from 'fastify';

import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { authMiddleware } from '../middlewares/auth-middleware';
import { verifyUserPermissions } from '../middlewares/permission-middleware';
import { createProductSchema } from '../schemas/product/create-product-schema';
import { updateProductSchema } from '../schemas/product/update-product-schema';
import { deleteProductSchema } from '../schemas/product/delete-product-schema';
import { listingProductsSchema } from '../schemas/product/listing-products-schema';
import { getProductDetailsSchema } from '../schemas/product/get-product-details-schema';
import { createProductController } from '../controllers/products/create-product-controller';
import { updateProductController } from '../controllers/products/update-product-controller';
import { listingProductsController } from '../controllers/products/listing-products-controller';
import { listingProductsByUserSchema } from '../schemas/product/listing-products-by-user-schema';
import { getProductDetailsController } from '../controllers/products/get-product-details-controller';
import { listingProductsByUserController } from '../controllers/products/listing-products-by-user-controller';
import { listingProductsCursorModeController } from '../controllers/products/listing-products-cursor-mode-controller';
import { listingProductsCursorModeSchema } from '../schemas/product/listing-products-cursor-mode-schema';

export async function productsRoutes(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.post(
			'/',
			{ preHandler: [authMiddleware, verifyUserPermissions('Product', 'create')], schema: createProductSchema },
			createProductController
		);

	app
		.withTypeProvider<ZodTypeProvider>()
		.put(
			'/:productId',
			{ preHandler: [authMiddleware, verifyUserPermissions('Product', 'update')], schema: updateProductSchema },
			updateProductController
		);

	app
		.withTypeProvider<ZodTypeProvider>()
		.delete(
			'/:productId',
			{ preHandler: [authMiddleware, verifyUserPermissions('Product', 'delete')], schema: deleteProductSchema },
			updateProductController
		);

	app
		.withTypeProvider<ZodTypeProvider>()
		.get(
			'/',
			{ preHandler: [authMiddleware, verifyUserPermissions('Product', 'read')], schema: listingProductsSchema },
			listingProductsController
		);

	app.withTypeProvider<ZodTypeProvider>().get(
		'/cursor-mode',
		{
			preHandler: [authMiddleware, verifyUserPermissions('Product', 'read')],
			schema: listingProductsCursorModeSchema,
		},
		listingProductsCursorModeController
	);

	app
		.withTypeProvider<ZodTypeProvider>()
		.get(
			'/user/:userId',
			{ preHandler: [authMiddleware, verifyUserPermissions('Product', 'read')], schema: listingProductsByUserSchema },
			listingProductsByUserController
		);

	app
		.withTypeProvider<ZodTypeProvider>()
		.get(
			'/:productId/details',
			{ preHandler: authMiddleware, schema: getProductDetailsSchema },
			getProductDetailsController
		);
}
