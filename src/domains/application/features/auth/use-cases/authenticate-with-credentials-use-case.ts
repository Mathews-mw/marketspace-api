import bcrypt from 'bcryptjs';
import { inject, injectable } from 'tsyringe';

import { User } from '@/domains/models/entities/user';
import { failure, Outcome, success } from '@/core/outcome';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';
import { IUserRepository } from '../../users/repositories/user-repository';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/containers/dependency-identifiers';

interface IRequest {
	email: string;
	password: string;
}

type Response = Outcome<UnauthorizedError, { user: User }>;

@injectable()
export class AuthenticateWithCredentialsUseCase {
	constructor(@inject(DEPENDENCY_IDENTIFIERS.USERS_REPOSITORY) private usersRepository: IUserRepository) {}

	async execute({ email, password }: IRequest): Promise<Response> {
		const user = await this.usersRepository.findByEmail(email);

		if (!user) {
			return failure(new UnauthorizedError('Invalid credentials!', 'AUTH_INVALID_CREDENTIALS'));
		}

		if (!user.password) {
			return failure(new UnauthorizedError('Invalid credentials!', 'AUTH_INVALID_CREDENTIALS'));
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return failure(new UnauthorizedError('Invalid credentials!', 'AUTH_INVALID_CREDENTIALS'));
		}

		return success({
			user,
		});
	}
}
