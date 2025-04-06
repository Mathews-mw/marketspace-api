import dayjs from 'dayjs';
import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { RegisterUserSessionUseCase } from '@/domains/application/features/auth/use-cases/register-user-session-use-case';
import { AuthenticateWithGoogleUseCase } from '@/domains/application/features/auth/use-cases/authenticate-with-google-use-case';

interface IQuery {
	code: string;
	scope: string;
	authuser: string;
	prompt: string;
}

export async function authenticateWithGoogleController(request: FastifyRequest, reply: FastifyReply) {
	const { code } = request.query as IQuery;

	const authService = container.resolve(AuthenticateWithGoogleUseCase);
	const sessionService = container.resolve(RegisterUserSessionUseCase);

	const result = await authService.execute({ code });

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
