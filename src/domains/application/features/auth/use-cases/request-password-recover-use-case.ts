import { inject, injectable } from 'tsyringe';

import { Token } from '@/domains/models/entities/token';
import { failure, Outcome, success } from '@/core/outcome';
import { ITokenRepository } from '../repositories/token-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { IUserRepository } from '../../users/repositories/user-repository';

interface IRequest {
	id: string;
}

type Response = Outcome<ResourceNotFoundError, { token: Token }>;

export class RequestPasswordRecoverUseCase {
	constructor(
		private usersRepository: IUserRepository,
		private tokenRepository: ITokenRepository
	) {}

	async execute({ id }: IRequest): Promise<Response> {
		const user = await this.usersRepository.findById(id);

		if (!user) {
			return failure(new ResourceNotFoundError('User not found'));
		}

		const newToken = Token.create({
			userId: user.id,
			type: 'PASSWORD_RESET',
		});

		await this.tokenRepository.create(newToken);

		return success({ token: newToken });
	}
}
