import { FastifyReply, FastifyRequest } from 'fastify';

export async function refreshTokenController(request: FastifyRequest, reply: FastifyReply) {
	await request.jwtVerify({ ignoreExpiration: true });

	const { sub, role } = request.user;

	const token = await reply.jwtSign(
		{
			role,
			sub,
		},
		{
			expiresIn: '3d',
		}
	);

	return reply.status(200).send({
		token,
	});
}
