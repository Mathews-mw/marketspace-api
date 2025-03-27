import { failure, Outcome, success } from '@/core/outcome';
import { Product } from '@/domains/models/entities/product';
import { IProductRepository } from '../repositories/product-repository';
import { IUserRepository } from '../../users/repositories/user-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { ForbiddenError } from '@/core/errors/forbidden-error';

interface IRequest {
	productId: string;
	userId: string;
	name?: string;
	description?: string;
	isNew?: boolean;
	price?: number;
	acceptTrade?: boolean;
	isActive?: boolean;
}

type Response = Outcome<ResourceNotFoundError | ForbiddenError, { product: Product }>;

export class UpdateProductUseCase {
	constructor(
		private usersRepository: IUserRepository,
		private productsRepository: IProductRepository
	) {}

	async execute({
		productId,
		name,
		description,
		isNew,
		price,
		acceptTrade,
		userId,
		isActive,
	}: IRequest): Promise<Response> {
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
				new ForbiddenError('You can only update a product that belongs to you.', 'INSUFFICIENT_PERMISSION')
			);
		}

		product.name = name ?? product.name;
		product.description = description ?? product.description;
		product.isNew = isNew ?? product.isNew;
		product.price = price ?? product.price;
		product.acceptTrade = acceptTrade ?? product.acceptTrade;
		product.isActive = isActive ?? product.isActive;

		await this.productsRepository.update(product);

		return success({ product });
	}
}
