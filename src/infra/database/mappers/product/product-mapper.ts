import { Product as PrismaProduct } from '@prisma/client';

import { Product } from '@/domains/models/entities/product';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export class ProductMapper {
	static toDomain(data: PrismaProduct): Product {
		return Product.create(
			{
				name: data.name,
				description: data.description,
				isNew: data.isNew,
				price: data.price,
				acceptTrade: data.acceptTrade,
				userId: new UniqueEntityId(data.userId),
				isActive: data.isActive,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: Product): PrismaProduct {
		return {
			id: data.id.toString(),
			name: data.name,
			description: data.description,
			isNew: data.isNew,
			price: data.price,
			acceptTrade: data.acceptTrade,
			userId: data.userId.toString(),
			isActive: data.isActive,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt ?? null,
		};
	}
}
