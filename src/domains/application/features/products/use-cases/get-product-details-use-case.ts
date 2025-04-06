import { inject, injectable } from 'tsyringe';

import { failure, Outcome, success } from '@/core/outcome';
import { IProductRepository } from '../repositories/product-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/containers/dependency-identifiers';
import { ProductDetails } from '@/domains/models/entities/value-objects/product-details';

interface IRequest {
	productId: string;
}

type Response = Outcome<ResourceNotFoundError, { product: ProductDetails }>;

@injectable()
export class GetProductDetailsUseCase {
	constructor(@inject(DEPENDENCY_IDENTIFIERS.PRODUCTS_REPOSITORY) private productsRepository: IProductRepository) {}

	async execute({ productId }: IRequest): Promise<Response> {
		const product = await this.productsRepository.findDetails(productId);

		if (!product) {
			return failure(new ResourceNotFoundError('Product not found', 'RESOURCE_NOT_FOUND'));
		}

		return success({ product });
	}
}
