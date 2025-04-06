import { prisma } from '../prisma';
import { PaymentMethodMapper } from '../mappers/product/payment-method-mapper';
import { PaymentMethod } from '@/domains/models/entities/payment-method';
import { IPaymentMethodRepository } from '@/domains/application/features/payment-methods/repositories/payment-method-repository';

export class PrismaPaymentMethodsRepository implements IPaymentMethodRepository {
	async create(paymentMethod: PaymentMethod) {
		const data = PaymentMethodMapper.toPrisma(paymentMethod);

		await prisma.paymentMethod.create({
			data,
		});

		return paymentMethod;
	}

	async createMany(paymentMethods: Array<PaymentMethod>): Promise<void> {
		const data = paymentMethods.map(PaymentMethodMapper.toPrisma);

		await prisma.paymentMethod.createMany({
			data,
		});
	}

	async update(paymentMethod: PaymentMethod) {
		const data = PaymentMethodMapper.toPrisma(paymentMethod);

		await prisma.paymentMethod.update({
			data,
			where: {
				id: data.id,
			},
		});

		return paymentMethod;
	}

	async delete(paymentMethod: PaymentMethod) {
		await prisma.paymentMethod.delete({
			where: {
				id: paymentMethod.id.toString(),
			},
		});
	}

	async deleteMany(toDelete: Array<string>) {
		await prisma.paymentMethod.deleteMany({
			where: {
				id: {
					in: toDelete,
				},
			},
		});
	}

	async findManyByProduct(productId: string) {
		const paymentMethods = await prisma.paymentMethod.findMany({
			where: {
				productId,
			},
		});

		return paymentMethods.map(PaymentMethodMapper.toDomain);
	}

	async findById(id: string) {
		const paymentMethod = await prisma.paymentMethod.findUnique({
			where: {
				id,
			},
		});

		if (!paymentMethod) {
			return null;
		}

		return PaymentMethodMapper.toDomain(paymentMethod);
	}
}
