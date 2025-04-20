import { inject, injectable } from 'tsyringe';

import { Outcome, success } from '@/core/outcome';
import { PaymentType } from '@/domains/models/entities/payment-method';
import { IProductRepository } from '../repositories/product-repository';
import { ProductInfo } from '@/domains/models/entities/value-objects/product-info';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/containers/dependency-identifiers';

interface IRequest {
	cursor?: string;
	limit: number;
	skip?: number;
	search?: string;
	isNew?: boolean;
	acceptTrade?: boolean;
	paymentMethods?: Array<PaymentType>;
}

type Response = Outcome<
	null,
	{ nextCursor?: string; previousCursor?: string; stillHaveData: boolean; products: Array<ProductInfo> }
>;

@injectable()
export class ListingProductsCursorModeUseCase {
	constructor(@inject(DEPENDENCY_IDENTIFIERS.PRODUCTS_REPOSITORY) private productsRepository: IProductRepository) {}

	async execute({ cursor, limit, skip, search, isNew, acceptTrade, paymentMethods }: IRequest): Promise<Response> {
		const { products, nextCursor, previousCursor, stillHaveData } = await this.productsRepository.findManyWithCursor({
			limit,
			cursor,
			skip,
			search,
			isNew,
			acceptTrade,
			paymentMethods,
		});

		return success({ nextCursor, previousCursor, stillHaveData, products });
	}
}
