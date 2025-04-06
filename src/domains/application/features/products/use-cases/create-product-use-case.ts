import { inject, injectable } from 'tsyringe';

import { failure, Outcome, success } from '@/core/outcome';
import { Product } from '@/domains/models/entities/product';
import { IProductRepository } from '../repositories/product-repository';
import { IUserRepository } from '../../users/repositories/user-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/containers/dependency-identifiers';
import { PaymentMethod, PaymentType } from '@/domains/models/entities/payment-method';
import { IPaymentMethodRepository } from '../../payment-methods/repositories/payment-method-repository';

interface IRequest {
	name: string;
	description: string;
	isNew: boolean;
	price: number;
	acceptTrade: boolean;
	userId: string;
	paymentTypes: Array<PaymentType>;
}

type Response = Outcome<ResourceNotFoundError, { product: Product }>;

@injectable()
export class CreateProductUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.USERS_REPOSITORY) private usersRepository: IUserRepository,
		@inject(DEPENDENCY_IDENTIFIERS.PRODUCTS_REPOSITORY) private productsRepository: IProductRepository,
		@inject(DEPENDENCY_IDENTIFIERS.PAYMENT_METHODS_REPOSITORY)
		private paymentMethodsRepository: IPaymentMethodRepository
	) {}

	async execute({ name, description, isNew, price, acceptTrade, userId, paymentTypes }: IRequest): Promise<Response> {
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

		const paymentMethods = paymentTypes.map((paymentType) => {
			return PaymentMethod.create({
				productId: newProduct.id,
				type: paymentType,
			});
		});

		await this.paymentMethodsRepository.createMany(paymentMethods);

		return success({ product: newProduct });
	}
}
