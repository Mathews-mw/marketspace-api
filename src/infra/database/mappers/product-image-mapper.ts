import { ProductImage as PrismaProductImage } from '@prisma/client';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ProductImage } from '@/domains/models/entities/product-image';

export class ProductImageMapper {
	static toDomain(data: PrismaProductImage): ProductImage {
		return ProductImage.create({
			title: data.title,
			url: data.url,
			productId: new UniqueEntityId(data.productId),
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
		});
	}

	static toPrisma(data: ProductImage): PrismaProductImage {
		return {
			id: data.id.toString(),
			title: data.title,
			url: data.url,
			productId: data.productId.toString(),
			createdAt: data.createdAt,
			updatedAt: data.updatedAt ?? null,
		};
	}
}
