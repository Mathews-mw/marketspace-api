import { makeUser } from '@/_tests/factories/make-user';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { InMemoryUserRepository } from '@/_tests/in-memory/in-memory-users-repository';
import { CreateUserUseCase } from '@/domains/application/features/users/use-cases/create-user-use-case';

let createUserUseCase: CreateUserUseCase;
let usersRepository: InMemoryUserRepository;

describe('Create User Use Case', () => {
	beforeAll(() => {
		usersRepository = new InMemoryUserRepository();
		createUserUseCase = new CreateUserUseCase(usersRepository);
	});

	test('Should be able to create a new user', async () => {
		const result = await createUserUseCase.execute({
			email: 'johndoe@example.com',
			name: 'John Doe',
			password: 'john@Doe#123',
			phone: '(674) 603-1033',
		});

		expect(result.isSuccess()).toBe(true);
		expect(result.value).toEqual({
			user: usersRepository.items[0],
		});
	});

	test('Should not be able to create an user with same email', async () => {
		const user = makeUser({
			email: 'johndoe@example.com',
		});

		usersRepository.items.push(user);

		const result = await createUserUseCase.execute({
			email: 'johndoe@example.com',
			name: 'John Doe',
			password: 'john@Doe#123',
			phone: '(674) 603-1033',
		});

		expect(result.isFalse()).toBe(true);
		expect(result.value).toBeInstanceOf(BadRequestError);
	});
});
