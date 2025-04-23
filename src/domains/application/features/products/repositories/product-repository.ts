import { Product } from '@/domains/models/entities/product';
import { ICursor } from '@/core/interfaces/paginating-interfaces';
import { PaymentType } from '@/domains/models/entities/payment-method';
import { ProductInfo } from '@/domains/models/entities/value-objects/product-info';
import { ProductDetails } from '@/domains/models/entities/value-objects/product-details';

export interface IProductQuerySearch {
	userId?: string;
	search?: string;
	isNew?: boolean;
	acceptTrade?: boolean;
	paymentMethods?: Array<PaymentType>;
}

export interface IProductQuerySearchWithCursor extends IProductQuerySearch {
	cursor?: string;
	limit: number;
	skip?: number;
}

export interface IProductByUserQuerySearch {
	userId: string;
	search?: string;
	isNew?: boolean;
	acceptTrade?: boolean;
	paymentMethods?: Array<PaymentType>;
}

export interface IFindUniqueParams {
	id?: string;
	email?: string;
}

export interface IProductCursorResponse extends ICursor {
	products: Array<ProductInfo>;
}

export interface IProductRepository {
	create(product: Product): Promise<Product>;
	update(product: Product): Promise<Product>;
	delete(product: Product): Promise<void>;
	findMany(query: IProductQuerySearch): Promise<{ amount: number; products: Array<ProductInfo> }>;
	findManyWithCursor(query: IProductQuerySearchWithCursor): Promise<IProductCursorResponse>;
	findManyByUser(query: IProductByUserQuerySearch): Promise<{ amount: number; products: Array<ProductInfo> }>;
	findById(id: string): Promise<Product | null>;
	findDetails(id: string): Promise<ProductDetails | null>;
}
