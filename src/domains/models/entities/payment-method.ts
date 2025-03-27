import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IPaymentMethodProps {
	key: string;
	name: string;
	productId: UniqueEntityId;
}

export class PaymentMethod extends Entity<IPaymentMethodProps> {
	get key() {
		return this.props.key;
	}

	set key(key: string) {
		this.props.key = key;
	}

	get name() {
		return this.props.name;
	}

	set name(name: string) {
		this.props.name = name;
	}

	get productId() {
		return this.props.productId;
	}

	set productId(productId: UniqueEntityId) {
		this.props.productId = productId;
	}

	static create(props: IPaymentMethodProps, id?: UniqueEntityId) {
		const paymentMethod = new PaymentMethod(props, id);

		return paymentMethod;
	}
}
