import { hash } from 'bcryptjs';
import { inject, injectable } from 'tsyringe';

import { User } from '@/domains/models/entities/user';
import { failure, Outcome, success } from '@/core/outcome';
import cryptographyConfig from '@/config/cryptography-config';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { IUserRepository } from '../repositories/user-repository';

interface IRequest {
	name: string;
	email: string;
	password: string;
	phone: string;
	avatar?: string;
}

type Response = Outcome<BadRequestError, { user: User }>;

export class CreateUserUseCase {
	constructor(private usersRepository: IUserRepository) {}

	async execute({ name, email, password, phone, avatar }: IRequest): Promise<Response> {
		const userWithSameEmail = await this.usersRepository.findByEmail(email);

		if (userWithSameEmail) {
			return failure(new BadRequestError('User with same e-mail already exists', 'SAME_EMAIL_ERROR'));
		}

		const hashPassword = await hash(password, cryptographyConfig.HASH_SALT_LENGTH);

		const newUser = User.create({
			name,
			email,
			password: hashPassword,
			phone,
			avatar,
		});

		await this.usersRepository.create(newUser);

		return success({ user: newUser });
	}
}
