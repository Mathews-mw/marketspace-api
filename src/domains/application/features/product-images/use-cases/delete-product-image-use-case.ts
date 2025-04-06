import { inject, injectable } from 'tsyringe';

import { failure, Outcome, success } from '@/core/outcome';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { IProductImageRepository } from '../repositories/product-image-repository';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/containers/dependency-identifiers';
import { IFirebaseStorageProvider } from '@/shared/providers/implementations/firebase-storage-provider';

interface IRequest {
	productImageId: string;
}

type Response = Outcome<ResourceNotFoundError, null>;

@injectable()
export class DeleteProductImageUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.PRODUCT_IMAGES_REPOSITORY) private productImageRepository: IProductImageRepository,
		@inject(DEPENDENCY_IDENTIFIERS.FIREBASE_STORAGE_PROVIDER) private firebaseStorageProvider: IFirebaseStorageProvider
	) {}

	async execute({ productImageId }: IRequest): Promise<Response> {
		const productImage = await this.productImageRepository.findById(productImageId);

		if (!productImage) {
			return failure(new ResourceNotFoundError('Product not found', 'RESOURCE_NOT_FOUND'));
		}

		await this.firebaseStorageProvider.delete(productImage.uniqueName);

		await this.productImageRepository.delete(productImage);

		return success(null);
	}
}
