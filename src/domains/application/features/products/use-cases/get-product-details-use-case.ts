import { failure, Outcome, success } from '@/core/outcome';
import { Product } from '@/domains/models/entities/product';
import { IProductRepository } from '../repositories/product-repository';
import { IUserRepository } from '../../users/repositories/user-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface IRequest {
	productId: string;
}

type Response = Outcome<ResourceNotFoundError, { product: Product }>;

export class ListingUserProductsUseCase {
	constructor(
		private usersRepository: IUserRepository,
		private productsRepository: IProductRepository
	) {}

	async execute({ productId }: IRequest): Promise<Response> {
		const product = await this.productsRepository.findDetails(productId);

		if (!product) {
			return failure(new ResourceNotFoundError('Product not found', 'RESOURCE_NOT_FOUND'));
		}

		return success({ product });
	}
}
