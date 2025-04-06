import { FastifyReply, FastifyRequest } from 'fastify';

export async function requestGoogleLoginController(request: FastifyRequest, reply: FastifyReply) {
	try {
		const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}&response_type=code&scope=profile email`;

		return reply.redirect(googleAuthUrl);
	} catch (error) {
		console.log('authenticateWithGoogleController error: ', error);
		return reply.status(500).send({ error: 'Erro ao autenticar com o Google' });
	}
}
