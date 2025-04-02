import { PaymentMethod } from '@/domains/models/entities/payment-method';

export interface IPaymentMethodRepository {
	create(paymentMethod: PaymentMethod): Promise<PaymentMethod>;
	update(paymentMethod: PaymentMethod): Promise<PaymentMethod>;
	delete(paymentMethod: PaymentMethod): Promise<void>;
	findManyByProduct(productId: string): Promise<PaymentMethod[]>;
	findById(id: string): Promise<PaymentMethod | null>;
}
