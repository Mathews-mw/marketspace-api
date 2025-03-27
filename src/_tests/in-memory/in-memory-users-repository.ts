import { User } from '@/domains/models/entities/user';
import {
	IFindUniqueParams,
	IUserQuerySearch,
	IUserRepository,
} from '@/domains/application/features/users/repositories/user-repository';

export class InMemoryUserRepository implements IUserRepository {
	public items: User[] = [];

	async create(user: User) {
		this.items.push(user);

		return user;
	}

	async update(user: User) {
		const userIndex = this.items.findIndex((item) => item.id === user.id);

		this.items[userIndex] = user;

		return user;
	}

	async delete(user: User) {
		const userIndex = this.items.findIndex((item) => item.id === user.id);

		this.items.slice(userIndex, 1);
	}

	async findMany({ page, perPage, search }: IUserQuerySearch) {
		const usersPaginated = this.items
			.filter((item) => (search ? item.name.toLowerCase().includes(search.toLocaleLowerCase()) : item))
			.slice((page - 1) * perPage, page * perPage);

		const totalOccurrences = usersPaginated.length;
		const totalPages = Math.ceil(totalOccurrences / perPage);

		const pagination = {
			page,
			perPage,
			totalPages,
			totalOccurrences,
		};

		return {
			pagination,
			users: usersPaginated,
		};
	}

	async findById(id: string) {
		const user = this.items.find((item) => item.id.toString() === id);

		if (!user) {
			return null;
		}

		return user;
	}

	async findByEmail(email: string) {
		const user = this.items.find((item) => item.email.toString() === email);

		if (!user) {
			return null;
		}

		return user;
	}

	async findUnique({ id, email }: IFindUniqueParams) {
		const user = this.items.find((item) => item.id.toString() === id || item.email === email);

		if (!user) {
			return null;
		}

		return user;
	}
}
