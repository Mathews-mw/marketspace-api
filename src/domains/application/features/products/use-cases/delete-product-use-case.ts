import { failure, Outcome, success } from '@/core/outcome';
import { ForbiddenError } from '@/core/errors/forbidden-error';
import { IProductRepository } from '../repositories/product-repository';
import { IUserRepository } from '../../users/repositories/user-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface IRequest {
	productId: string;
	userId: string;
}

type Response = Outcome<ResourceNotFoundError | ForbiddenError, { message: string }>;

export class DeleteProductUseCase {
	constructor(
		private usersRepository: IUserRepository,
		private productsRepository: IProductRepository
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

		await this.productsRepository.delete(product);

		return success({ message: 'Product deleted successfully' });
	}
}
