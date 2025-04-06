import { inject, injectable } from 'tsyringe';

import { Outcome, success } from '@/core/outcome';
import { Session } from '@/domains/models/entities/session';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/containers/dependency-identifiers';
import { ISessionRepository } from '../../users/repositories/session-repository';

interface IRequest {
	userId: string;
	token: string;
	expiresAt: Date;
}

type Response = Outcome<UnauthorizedError, { message: string }>;

@injectable()
export class RegisterUserSessionUseCase {
	constructor(@inject(DEPENDENCY_IDENTIFIERS.SESSIONS_REPOSITORY) private sessionsRepository: ISessionRepository) {}

	async execute({ userId, token, expiresAt }: IRequest): Promise<Response> {
		const userSessions = await this.sessionsRepository.findByUserId(userId);

		if (!userSessions) {
			const newSession = Session.create({
				token,
				userId: new UniqueEntityId(userId),
				expiresAt,
				registerAt: new Date(),
			});

			await this.sessionsRepository.create(newSession);
		} else {
			userSessions.token = token;
			userSessions.expiresAt = expiresAt;
			userSessions.registerAt = new Date();

			await this.sessionsRepository.update(userSessions);
		}

		return success({
			message: 'Sessions Successfully registered',
		});
	}
}
