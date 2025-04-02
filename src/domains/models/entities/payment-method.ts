import { z } from 'zod';

import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export const paymentTypeSchema = z.union([
	z.literal('PIX'),
	z.literal('BOLETO'),
	z.literal('DEBITO'),
	z.literal('CREDITO'),
	z.literal('DINHEIRO'),
	z.literal('DEPOSITO'),
]);

export type PaymentType = z.infer<typeof paymentTypeSchema>;

export interface IPaymentMethodProps {
	type: PaymentType;
	productId: UniqueEntityId;
}

export class PaymentMethod extends Entity<IPaymentMethodProps> {
	get type() {
		return this.props.type;
	}

	set type(type: PaymentType) {
		this.props.type = type;
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
