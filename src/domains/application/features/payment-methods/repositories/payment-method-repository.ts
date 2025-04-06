import { PaymentMethod } from '@/domains/models/entities/payment-method';

export interface IPaymentMethodRepository {
	create(paymentMethod: PaymentMethod): Promise<PaymentMethod>;
	createMany(paymentMethods: Array<PaymentMethod>): Promise<void>;
	update(paymentMethod: PaymentMethod): Promise<PaymentMethod>;
	delete(paymentMethod: PaymentMethod): Promise<void>;
	deleteMany(toDelete: Array<string>): Promise<void>;
	findManyByProduct(productId: string): Promise<PaymentMethod[]>;
	findById(id: string): Promise<PaymentMethod | null>;
}
