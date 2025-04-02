import { Account } from '@/domains/models/entities/account';

export interface IAccountRepository {
	create(account: Account): Promise<Account>;
	update(account: Account): Promise<Account>;
	delete(account: Account): Promise<void>;
	findManyByUserId(userId: string): Promise<Account[]>;
	findById(id: string): Promise<Account | null>;
}
