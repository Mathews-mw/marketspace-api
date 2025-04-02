import { User as PrismaUser } from '@prisma/client';

import { User } from '@/domains/models/entities/user';

export class UserMapper {
	static toDomain(data: PrismaUser): User {
		return User.create({
			name: data.name,
			email: data.email,
			phone: data.phone,
			password: data.password,
			role: data.role,
			avatar: data.avatar,
			isActive: data.isActive,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
		});
	}

	static toPrisma(data: User): PrismaUser {
		return {
			id: data.id.toString(),
			name: data.name,
			email: data.email,
			phone: data.phone,
			password: data.password,
			role: data.role,
			avatar: data.avatar ?? null,
			isActive: data.isActive,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt ?? null,
		};
	}
}
