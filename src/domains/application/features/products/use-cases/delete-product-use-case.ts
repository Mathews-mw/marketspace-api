import { inject, injectable } from 'tsyringe';

import { failure, Outcome, success } from '@/core/outcome';
import { ForbiddenError } from '@/core/errors/forbidden-error';
import { IProductRepository } from '../repositories/product-repository';
import { IUserRepository } from '../../users/repositories/user-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/containers/dependency-identifiers';
import { IProductImageRepository } from '../../product-images/repositories/product-image-repository';
import { IFirebaseStorageProvider } from '@/shared/providers/implementations/firebase-storage-provider';

interface IRequest {
	productId: string;
	userId: string;
}

type Response = Outcome<ResourceNotFoundError | ForbiddenError, { message: string }>;

@injectable()
export class DeleteProductUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.USERS_REPOSITORY) private usersRepository: IUserRepository,
		@inject(DEPENDENCY_IDENTIFIERS.PRODUCTS_REPOSITORY) private productsRepository: IProductRepository,
		@inject(DEPENDENCY_IDENTIFIERS.PRODUCT_IMAGES_REPOSITORY) private productImageRepository: IProductImageRepository,
		@inject(DEPENDENCY_IDENTIFIERS.FIREBASE_STORAGE_PROVIDER) private firebaseStorageProvider: IFirebaseStorageProvider
	) {}

	async execute({ productId, userId }: IRequest): Promise<Response> {
		const user = await this.usersRepository.findById(userId);
		const product = await this.productsRepository.findById(productId);

		if (!user) {
			return failure(new ResourceNotFoundError('User not found', 'RESOURCE_NOT_FOUND'));
		}

		if (!product) {
			return failure(new ResourceNotFoundError('Product not found', 'RESOURCE_NOT_FOUND'));
		}

		if (product.userId.toString() !== userId) {
			return failure(
				new ForbiddenError('You can only delete a product that belongs to you.', 'INSUFFICIENT_PERMISSION')
			);
		}

		const productImages = await this.productImageRepository.findManyByProduct(product.id.toString());

		for await (const productImage of productImages) {
			await this.firebaseStorageProvider.delete(productImage.uniqueName);
		}

		await this.productsRepository.delete(product);

		return success({ message: 'Product deleted successfully' });
	}
}
