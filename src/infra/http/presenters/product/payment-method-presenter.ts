import { PaymentMethod } from '@/domains/models/entities/payment-method';

export class PaymentMethodPresenter {
	static toHTTP(data: PaymentMethod) {
		let label = '';

		switch (data.type) {
			case 'PIX':
				label = 'Pix';
				break;
			case 'BOLETO':
				label = 'Boleto';
				break;
			case 'CREDITO':
				label = 'Cartão de crédito';
				break;
			case 'DEBITO':
				label = 'Débito';
				break;
			case 'DEPOSITO':
				label = 'Depósito';
				break;
			case 'DINHEIRO':
				label = 'Dinheiro';
				break;
			default:
				label = 'PIX';
				break;
		}

		return {
			id: data.id.toString(),
			type: data.type,
			label,
			product_id: data.productId.toString(),
		};
	}
}
