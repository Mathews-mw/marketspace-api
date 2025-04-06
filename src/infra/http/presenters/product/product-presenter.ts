import { Product } from '@/domains/models/entities/product';

export class ProductPresenter {
	static toHTTP(data: Product) {
		return {
			id: data.id.toString(),
			name: data.name,
			description: data.description,
			price: data.price,
			is_new: data.isNew,
			accept_trade: data.acceptTrade,
			user_id: data.userId.toString(),
			is_active: data.isActive,
			created_at: data.createdAt,
			updated_at: data.updatedAt ?? null,
		};
	}
}
