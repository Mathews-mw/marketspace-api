import { inject, injectable } from 'tsyringe';

import { Outcome, success } from '@/core/outcome';
import { PaymentType } from '@/domains/models/entities/payment-method';
import { IProductRepository } from '../repositories/product-repository';
import { ProductInfo } from '@/domains/models/entities/value-objects/product-info';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/containers/dependency-identifiers';

interface IRequest {
	search?: string;
	isNew?: boolean;
	acceptTrade?: boolean;
	paymentMethods?: Array<PaymentType>;
}

type Response = Outcome<null, { amount: number; products: ProductInfo[] }>;

@injectable()
export class ListingProductsUseCase {
	constructor(@inject(DEPENDENCY_IDENTIFIERS.PRODUCTS_REPOSITORY) private productsRepository: IProductRepository) {}

	async execute({ search, isNew, acceptTrade, paymentMethods }: IRequest): Promise<Response> {
		const { products, amount } = await this.productsRepository.findMany({ search, isNew, acceptTrade, paymentMethods });

		return success({ amount, products });
	}
}
