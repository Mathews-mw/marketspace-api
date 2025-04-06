import {
	Product as PrismaProduct,
	ProductImage as PrismaProductImage,
	PaymentMethod as PrismaPaymentMethod,
} from '@prisma/client';

import { ProductImageMapper } from './product-image-mapper';
import { PaymentMethodMapper } from './payment-method-mapper';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ProductInfo } from '@/domains/models/entities/value-objects/product-info';

type IPrismaProductInfo = PrismaProduct & {
	paymentMethods: Array<PrismaPaymentMethod>;
	productImages: Array<PrismaProductImage>;
};

export class ProductInfoMapper {
	static toDomain(data: IPrismaProductInfo): ProductInfo {
		return ProductInfo.create({
			id: new UniqueEntityId(data.id),
			name: data.name,
			description: data.description,
			isNew: data.isNew,
			price: data.price,
			acceptTrade: data.acceptTrade,
			userId: new UniqueEntityId(data.userId),
			isActive: data.isActive,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			images: data.productImages.map(ProductImageMapper.toDomain),
			paymentMethods: data.paymentMethods.map(PaymentMethodMapper.toDomain),
		});
	}
}
