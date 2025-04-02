import firebaseConfig from '@/config/firebase-config';
import { failure, Outcome, success } from '@/core/outcome';
import { MultipartFile } from '@fastify/multipart/types/index';
import { ProductImage } from '@/domains/models/entities/product-image';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { IProductImageRepository } from '../repositories/product-image-repository';
import { IProductRepository } from '../../products/repositories/product-repository';
import { IFirebaseStorageProvider } from '@/shared/providers/implementations/firebase-storage-provider';

interface IRequest {
	productId: string;
	files: MultipartFile[];
}

type Response = Outcome<ResourceNotFoundError, null>;

export class UploadProductImageUseCase {
	constructor(
		private productsRepository: IProductRepository,
		private productImageRepository: IProductImageRepository,
		private firebaseStorageProvider: IFirebaseStorageProvider
	) {}

	async execute({ productId, files }: IRequest): Promise<Response> {
		const product = await this.productsRepository.findById(productId);

		if (!product) {
			return failure(new ResourceNotFoundError('Product not found', 'RESOURCE_NOT_FOUND'));
		}

		for await (const file of files) {
			const uniqueFileName = `${Date.now()}_${file.filename}`;
			const destination = `${firebaseConfig.folders.FILES}/${uniqueFileName}`;

			const { publicUrl } = await this.firebaseStorageProvider.upload({ destination, file, makePublic: true });

			const productImage = ProductImage.create({
				productId: product.id,
				title: uniqueFileName,
				url: publicUrl,
			});

			await this.productImageRepository.create(productImage);
		}

		return success(null);
	}
}
