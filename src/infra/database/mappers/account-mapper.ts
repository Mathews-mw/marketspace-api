import { Account as PrismaAccount } from '@prisma/client';

import { Account } from '@/domains/models/entities/account';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export class AccountMapper {
	static toDomain(data: PrismaAccount): Account {
		return Account.create({
			userId: new UniqueEntityId(data.userId),
			provider: data.provider,
			providerAccountId: data.providerAccountId,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
		});
	}

	static toPrisma(data: Account): PrismaAccount {
		return {
			id: data.id.toString(),
			userId: data.userId.toString(),
			provider: data.provider,
			providerAccountId: data.providerAccountId,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt ?? null,
		};
	}
}
