import {
	User as PrismaUser,
	Product as PrismaProduct,
	ProductImage as PrismaProductImage,
	PaymentMethod as PrismaPaymentMethod,
} from '@prisma/client';

import { UserMapper } from '../user/user-mapper';
import { ProductImageMapper } from './product-image-mapper';
import { PaymentMethodMapper } from './payment-method-mapper';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ProductDetails } from '@/domains/models/entities/value-objects/product-details';

type IPrismaProductDetails = PrismaProduct & {
	user: PrismaUser;
	productImages: Array<PrismaProductImage>;
	paymentMethods: Array<PrismaPaymentMethod>;
};

export class ProductDetailsMapper {
	static toDomain(data: IPrismaProductDetails): ProductDetails {
		return ProductDetails.create({
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
			user: UserMapper.toDomain(data.user),
		});
	}
}
