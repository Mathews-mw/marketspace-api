import { inject, injectable } from 'tsyringe';

import { User } from '@/domains/models/entities/user';
import { failure, Outcome, success } from '@/core/outcome';
import { IUserRepository } from '../repositories/user-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface IRequest {
	id?: string;
	email?: string;
}

type Response = Outcome<ResourceNotFoundError, { user: User }>;

export class GetUniqueUserUseCase {
	constructor(private usersRepository: IUserRepository) {}

	async execute({ id, email }: IRequest): Promise<Response> {
		const user = await this.usersRepository.findUnique({ id, email });

		if (!user) {
			return failure(new ResourceNotFoundError('User not found', 'RESOURCE_NOT_FOUND'));
		}

		return success({ user });
	}
}
