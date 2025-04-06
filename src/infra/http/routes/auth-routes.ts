import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { refreshTokenSchema } from '../schemas/auth/refresh-token-schema';
import { authenticateUserSchema } from '../schemas/auth/authenticate-user-schema';
import { refreshTokenController } from '../controllers/auth/refresh-token-controller';
import { requestGoogleLoginController } from '../controllers/auth/request-google-login-controller';
import { authenticateWithGoogleController } from '../controllers/auth/authenticate-with-google-controller';
import { authenticateWithCredentialsController } from '../controllers/auth/authenticate-with-credentials-controller';

export async function authRoutes(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		'/credentials',
		{
			schema: authenticateUserSchema,
		},
		authenticateWithCredentialsController
	);

	app.withTypeProvider<ZodTypeProvider>().patch(
		'/refresh-token',

		{
			schema: refreshTokenSchema,
		},
		refreshTokenController
	);

	app.get('/google', { schema: { hide: true } }, requestGoogleLoginController);
	app.get('/google/callback', { schema: { hide: true } }, authenticateWithGoogleController);
}
