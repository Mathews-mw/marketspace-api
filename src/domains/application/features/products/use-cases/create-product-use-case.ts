import { failure, Outcome, success } from '@/core/outcome';
import { Product } from '@/domains/models/entities/product';
import { IProductRepository } from '../repositories/product-repository';
import { IUserRepository } from '../../users/repositories/user-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface IRequest {
	name: string;
	description: string;
	isNew: boolean;
	price: number;
	acceptTrade: boolean;
	userId: string;
}

type Response = Outcome<ResourceNotFoundError, { product: Product }>;

export class CreateProductUseCase {
	constructor(
		private usersRepository: IUserRepository,
		private productsRepository: IProductRepository
	) {}

	async execute({ name, description, isNew, price, acceptTrade, userId }: IRequest): Promise<Response> {
		const user = await this.usersRepository.findById(userId);

		if (!user) {
			return failure(new ResourceNotFoundError('User not found', 'RESOURCE_NOT_FOUND'));
		}

		const newProduct = Product.create({
			name,
			description,
			isNew,
			price,
			acceptTrade,
			userId: user.id,
			isActive: true,
		});

		await this.productsRepository.create(newProduct);

		return success({ product: newProduct });
	}
}
