import { ProductImagePresenter } from './product-image-presenter';
import { PaymentMethodPresenter } from './payment-method-presenter';
import { ProductDetails } from '@/domains/models/entities/value-objects/product-details';
import { UserPresenter } from '../user/user-presenter';

export class ProductDetailsPresenter {
	static toHTTP(data: ProductDetails) {
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
			payment_methods: data.paymentMethods.map(PaymentMethodPresenter.toHTTP),
			owner: UserPresenter.toHTTP(data.user),
		};
	}
}
