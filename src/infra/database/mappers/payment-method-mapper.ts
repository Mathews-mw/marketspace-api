import { PaymentMethod as PrismaPaymentMethod } from '@prisma/client';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { PaymentMethod } from '@/domains/models/entities/payment-method';

export class PaymentMethodMapper {
	static toDomain(data: PrismaPaymentMethod): PaymentMethod {
		return PaymentMethod.create({
			type: data.type,
			productId: new UniqueEntityId(data.productId),
		});
	}

	static toPrisma(data: PaymentMethod): PrismaPaymentMethod {
		return {
			id: data.id.toString(),
			type: data.type,
			productId: data.productId.toString(),
		};
	}
}
