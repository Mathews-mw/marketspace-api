import { inject, injectable } from 'tsyringe';

import { User } from '@/domains/models/entities/user';
import { failure, Outcome, success } from '@/core/outcome';
import { PaymentType } from '@/domains/models/entities/payment-method';
import { IUserRepository } from '../../users/repositories/user-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { ProductInfo } from '@/domains/models/entities/value-objects/product-info';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/containers/dependency-identifiers';
import { IProductRepository } from '../../products/repositories/product-repository';

interface IRequest {
	userId: string;
	search?: string;
	isNew?: boolean;
	acceptTrade?: boolean;
	paymentMethods?: Array<PaymentType>;
}

type Response = Outcome<
	ResourceNotFoundError,
	{
		user: User;
		productsArgs: {
			amount: number;
			products: ProductInfo[];
		};
	}
>;

@injectable()
export class ListingUserProductsUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.USERS_REPOSITORY) private usersRepository: IUserRepository,
		@inject(DEPENDENCY_IDENTIFIERS.PRODUCTS_REPOSITORY) private productsRepository: IProductRepository
	) {}

	async execute({ userId, search, isNew, acceptTrade, paymentMethods }: IRequest): Promise<Response> {
		const user = await this.usersRepository.findById(userId);

		if (!user) {
			return failure(new ResourceNotFoundError('User not found', 'RESOURCE_NOT_FOUND'));
		}

		const { products, amount } = await this.productsRepository.findMany({
			userId,
			search,
			isNew,
			acceptTrade,
			paymentMethods,
		});

		return success({
			user,
			productsArgs: {
				amount,
				products,
			},
		});
	}
}
