import { UnauthorizedError } from '@/core/errors/unauthorized-error';
import { InMemoryUserRepository } from '@/_tests/in-memory/in-memory-users-repository';
import { CreateUserUseCase } from '@/domains/application/features/users/use-cases/create-user-use-case';
import { AuthenticateUserUseCase } from '@/domains/application/features/auth/use-cases/authenticate-user-use-case';

let createUserUseCase: CreateUserUseCase;
let usersRepository: InMemoryUserRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe('Authenticate User Use Case', () => {
	beforeAll(() => {
		usersRepository = new InMemoryUserRepository();
		createUserUseCase = new CreateUserUseCase(usersRepository);
		authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
	});

	test('Should be able to authenticate an existing user', async () => {
		await createUserUseCase.execute({
			email: 'johndoe@example.com',
			name: 'John Doe',
			password: '123456',
			phone: '(674) 603-1033',
		});

		const result = await authenticateUserUseCase.execute({
			email: 'johndoe@example.com',
			password: '123456',
		});

		expect(result.isSuccess()).toBe(true);
		expect(result.value).toEqual({
			user: usersRepository.items[0],
		});
	});

	test('Should no be able to authenticate a nonexisting user', async () => {
		const result = await authenticateUserUseCase.execute({
			email: 'bo@aj.nc',
			password: '123456789',
		});

		expect(result.isFalse()).toBe(true);
		expect(result.value).toBeInstanceOf(UnauthorizedError);
	});
});
