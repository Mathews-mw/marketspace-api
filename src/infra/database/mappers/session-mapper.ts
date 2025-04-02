import { Session as PrismaSession } from '@prisma/client';

import { Session } from '@/domains/models/entities/session';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export class SessionMapper {
	static toDomain(data: PrismaSession): Session {
		return Session.create({
			userId: new UniqueEntityId(data.userId),
			token: data.token,
			expiresAt: data.expiresAt,
			registerAt: data.registerAt,
		});
	}

	static toPrisma(data: Session): PrismaSession {
		return {
			id: data.id.toString(),
			userId: data.userId.toString(),
			token: data.token,
			expiresAt: data.expiresAt,
			registerAt: data.registerAt,
		};
	}
}
