import { User } from '@/domains/models/entities/user';
import { PaymentType } from '@/domains/models/entities/payment-method';
import { ProductInfo } from '@/domains/models/entities/value-objects/product-info';

export interface IUserQuerySearch {
	search?: string;
}

export interface IFindUniqueParams {
	id?: string;
	email?: string;
}

export interface IFindManyProductQuerySearch {
	userId: string;
	search?: string;
	isNew?: boolean;
	acceptTrade?: boolean;
	paymentMethods?: Array<PaymentType>;
}

export interface IUserRepository {
	create(user: User): Promise<User>;
	update(user: User): Promise<User>;
	delete(user: User): Promise<void>;
	findMany(query: IUserQuerySearch): Promise<User[]>;
	findById(id: string): Promise<User | null>;
	findByEmail(email: string): Promise<User | null>;
	findUnique(params: IFindUniqueParams): Promise<User | null>;
}
