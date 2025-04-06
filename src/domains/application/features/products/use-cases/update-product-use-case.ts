import { inject, injectable } from 'tsyringe';

import { failure, Outcome, success } from '@/core/outcome';
import { Product } from '@/domains/models/entities/product';
import { ForbiddenError } from '@/core/errors/forbidden-error';
import { IProductRepository } from '../repositories/product-repository';
import { IUserRepository } from '../../users/repositories/user-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/containers/dependency-identifiers';
import { PaymentMethod, PaymentType } from '@/domains/models/entities/payment-method';
import { IPaymentMethodRepository } from '../../payment-methods/repositories/payment-method-repository';

interface IRequest {
	productId: string;
	userId: string;
	name?: string;
	description?: string;
	isNew?: boolean;
	price?: number;
	acceptTrade?: boolean;
	isActive?: boolean;
	paymentTypes?: Array<PaymentType>;
}

type Response = Outcome<ResourceNotFoundError | ForbiddenError, { product: Product }>;

@injectable()
export class UpdateProductUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.USERS_REPOSITORY) private usersRepository: IUserRepository,
		@inject(DEPENDENCY_IDENTIFIERS.PRODUCTS_REPOSITORY) private productsRepository: IProductRepository,
		@inject(DEPENDENCY_IDENTIFIERS.PAYMENT_METHODS_REPOSITORY)
		private paymentMethodsRepository: IPaymentMethodRepository
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
		paymentTypes,
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

		if (paymentTypes) {
			const productPaymentMethodsDb = await this.paymentMethodsRepository.findManyByProduct(productId);

			const { toCreate, toDelete } = this.mapPaymentMethodsToUpdate(productPaymentMethodsDb, paymentTypes, product);

			await this.paymentMethodsRepository.createMany(toCreate);
			await this.paymentMethodsRepository.deleteMany(toDelete);
		}

		return success({ product });
	}

	private mapPaymentMethodsToUpdate(db: Array<PaymentMethod>, paymentTypes: Array<PaymentType>, product: Product) {
		const toCreate: Array<PaymentMethod> = [];
		const toDelete: Array<string> = [];

		const dbMap = new Map<string, PaymentMethod>();
		const updatesMap = new Map<string, string>();

		db.forEach((item) => dbMap.set(item.type, item));
		paymentTypes.forEach((item) => updatesMap.set(item, item));

		// To create
		paymentTypes.forEach((paymentType) => {
			if (!dbMap.has(paymentType)) {
				toCreate.push(
					PaymentMethod.create({
						productId: product.id,
						type: paymentType,
					})
				);
			}
		});

		//To delete
		db.forEach((paymentType) => {
			if (!updatesMap.has(paymentType.type)) {
				toDelete.push(paymentType.id.toString());
			}
		});

		return {
			toCreate,
			toDelete,
		};
	}
}
