import { User } from '../user';
import { IProductProps } from '../product';
import { ProductImage } from '../product-image';
import { PaymentMethod } from '../payment-method';
import { ValueObject } from '@/core/entities/value-object';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IProductDetails extends IProductProps {
	id: UniqueEntityId;
	images: Array<ProductImage>;
	paymentMethods: Array<PaymentMethod>;
	user: User;
}

export class ProductDetails extends ValueObject<IProductDetails> {
	get id() {
		return this.props.id;
	}

	get name() {
		return this.props.name;
	}

	get description() {
		return this.props.description;
	}

	get isNew() {
		return this.props.isNew;
	}

	get price() {
		return this.props.price;
	}

	get acceptTrade() {
		return this.props.acceptTrade;
	}

	get userId() {
		return this.props.userId;
	}

	get isActive() {
		return this.props.isActive;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	get images() {
		return this.props.images;
	}

	get paymentMethods() {
		return this.props.paymentMethods;
	}

	get user() {
		return this.props.user;
	}

	static create(props: IProductDetails) {
		const productDetails = new ProductDetails(props);

		return productDetails;
	}
}
