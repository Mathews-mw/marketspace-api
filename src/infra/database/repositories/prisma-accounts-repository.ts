import { prisma } from '../prisma';
import { AccountMapper } from '../mappers/user/account-mapper';
import { Account } from '@/domains/models/entities/account';
import { IAccountRepository, IParams } from '@/domains/application/features/users/repositories/account-repository';

export class PrismaAccountsRepository implements IAccountRepository {
	async create(account: Account) {
		const data = AccountMapper.toPrisma(account);

		await prisma.account.create({
			data,
		});

		return account;
	}

	async update(account: Account) {
		const data = AccountMapper.toPrisma(account);

		await prisma.account.update({
			data,
			where: {
				id: data.id,
			},
		});

		return account;
	}

	async delete(account: Account) {
		await prisma.account.delete({
			where: {
				id: account.id.toString(),
			},
		});
	}

	async findManyByUserId(userId: string) {
		const userAccounts = await prisma.account.findMany({
			where: {
				userId,
			},
		});

		return userAccounts.map(AccountMapper.toDomain);
	}

	async findById(id: string) {
		const account = await prisma.account.findUnique({
			where: {
				id,
			},
		});

		if (!account) {
			return null;
		}

		return AccountMapper.toDomain(account);
	}

	async findUniqueByProvider({ userId, provider }: IParams): Promise<Account | null> {
		const account = await prisma.account.findUnique({
			where: {
				userId_provider: {
					userId: userId,
					provider,
				},
			},
		});

		if (!account) {
			return null;
		}

		return AccountMapper.toDomain(account);
	}
}
