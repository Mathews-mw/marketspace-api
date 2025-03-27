import { User } from '@/domains/models/entities/user';
import { failure, Outcome, success } from '@/core/outcome';
import { IUserRepository } from '../repositories/user-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface IRequest {
	id: string;
	name: string;
	email: string;
	phone: string;
	avatar?: string;
}

type Response = Outcome<ResourceNotFoundError, { user: User }>;

export class EditUserUseCase {
	constructor(private usersRepository: IUserRepository) {}

	async execute({ id, name, email, phone, avatar }: IRequest): Promise<Response> {
		const user = await this.usersRepository.findById(id);

		if (!user) {
			return failure(new ResourceNotFoundError('User not found', 'RESOURCE_NOT_FOUND'));
		}

		user.name = name ?? user.name;
		user.email = email ?? user.email;
		user.phone = phone ?? user.phone;
		user.avatar = avatar ?? user.avatar;

		await this.usersRepository.update(user);

		return success({ user });
	}
}
