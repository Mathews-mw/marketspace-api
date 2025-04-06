import dayjs from 'dayjs';
import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { AuthenticateUserRequest } from '../schemas/auth/authenticate-user-schema';
import { RegisterUserSessionUseCase } from '@/domains/application/features/auth/use-cases/register-user-session-use-case';
import { AuthenticateWithCredentialsUseCase } from '@/domains/application/features/auth/use-cases/authenticate-with-credentials-use-case';

export async function authenticateWithCredentialsController(request: FastifyRequest, reply: FastifyReply) {
	const { email, password } = request.body as AuthenticateUserRequest;

	const authService = container.resolve(AuthenticateWithCredentialsUseCase);
	const sessionService = container.resolve(RegisterUserSessionUseCase);

	const result = await authService.execute({
		email,
		password,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	const { user } = result.value;

	const token = await reply.jwtSign(
		{
			role: user.role,
			sub: user.id.toString(),
		},
		{
			expiresIn: '3d',
		}
	);

	await sessionService.execute({
		token,
		userId: user.id.toString(),
		expiresAt: dayjs().add(3, 'days').toDate(),
	});

	return reply.status(200).send({
		token,
	});
}
