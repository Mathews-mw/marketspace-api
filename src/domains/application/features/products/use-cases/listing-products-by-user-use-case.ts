import { inject, injectable } from 'tsyringe';

import { failure, Outcome, success } from '@/core/outcome';
import { PaymentType } from '@/domains/models/entities/payment-method';
import { IProductRepository } from '../repositories/product-repository';
import { IUserRepository } from '../../users/repositories/user-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/containers/dependency-identifiers';
import { ProductDetails } from '@/domains/models/entities/value-objects/product-details';

interface IRequest {
	userId: string;
	search?: string;
	isNew?: boolean;
	acceptTrade?: boolean;
	paymentMethods?: Array<PaymentType>;
}

type Response = Outcome<ResourceNotFoundError, { amount: number; products: ProductDetails[] }>;

@injectable()
export class ListingUserProductsByUserUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.USERS_REPOSITORY) private usersRepository: IUserRepository,
		@inject(DEPENDENCY_IDENTIFIERS.PRODUCTS_REPOSITORY) private productsRepository: IProductRepository
	) {}

	async execute({ userId, search, isNew, acceptTrade, paymentMethods }: IRequest): Promise<Response> {
		const user = await this.usersRepository.findById(userId);

		if (!user) {
			return failure(new ResourceNotFoundError('User not found', 'RESOURCE_NOT_FOUND'));
		}

		const { amount, products } = await this.productsRepository.findManyByUser({
			userId,
			search,
			isNew,
			acceptTrade,
			paymentMethods,
		});

		return success({ amount, products });
	}
}
