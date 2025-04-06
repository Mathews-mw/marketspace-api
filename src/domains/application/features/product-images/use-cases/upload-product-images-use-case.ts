import { inject, injectable } from 'tsyringe';

import { failure, Outcome, success } from '@/core/outcome';
import { ProductImage } from '@/domains/models/entities/product-image';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { IProductImageRepository } from '../repositories/product-image-repository';
import { IProductRepository } from '../../products/repositories/product-repository';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/containers/dependency-identifiers';
import { IFirebaseStorageProvider } from '@/shared/providers/implementations/firebase-storage-provider';

interface IRequest {
	productId: string;
	fileStream: NodeJS.ReadableStream;
	fileName: string;
	contentType: string;
}

type Response = Outcome<ResourceNotFoundError, null>;

@injectable()
export class UploadProductImageUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.PRODUCTS_REPOSITORY) private productsRepository: IProductRepository,
		@inject(DEPENDENCY_IDENTIFIERS.PRODUCT_IMAGES_REPOSITORY) private productImageRepository: IProductImageRepository,
		@inject(DEPENDENCY_IDENTIFIERS.FIREBASE_STORAGE_PROVIDER) private firebaseStorageProvider: IFirebaseStorageProvider
	) {}

	async execute({ productId, fileStream, fileName, contentType }: IRequest): Promise<Response> {
		const product = await this.productsRepository.findById(productId);

		if (!product) {
			return failure(new ResourceNotFoundError('Product not found', 'RESOURCE_NOT_FOUND'));
		}

		const uniqueFileName = `${Date.now()}_${fileName}`;

		const { publicUrl } = await this.firebaseStorageProvider.upload({
			fileStream,
			fileName: uniqueFileName,
			contentType,
			makePublic: true,
		});

		const productImage = ProductImage.create({
			productId: product.id,
			fileName: fileName,
			uniqueName: uniqueFileName,
			url: publicUrl,
		});

		await this.productImageRepository.create(productImage);

		return success(null);
	}
}
