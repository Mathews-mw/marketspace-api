import { ProductImagePresenter } from './product-image-presenter';
import { PaymentMethodPresenter } from './payment-method-presenter';
import { ProductInfo } from '@/domains/models/entities/value-objects/product-info';

export class ProductInfoPresenter {
	static toHTTP(data: ProductInfo) {
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
			images: data.images.map(ProductImagePresenter.toHTTP),
			paymentMethods: data.paymentMethods.map(PaymentMethodPresenter.toHTTP),
		};
	}
}
