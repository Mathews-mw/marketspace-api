import 'reflect-metadata';
import '@/shared/containers/index';

import fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyCors from '@fastify/cors';
import fastifyEtag from '@fastify/etag';
import fastifyRedis from '@fastify/redis';
import fastifyCookie from '@fastify/cookie';
import fastifyCaching from '@fastify/caching';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifyMultipart from '@fastify/multipart';
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from 'fastify-type-provider-zod';

import { env } from '@/env';
import { routes } from './http/routes';
import { errorHandler } from './error-handler';
import { cachePlugin } from './http/middlewares/cache-middleware';

export const app = fastify().withTypeProvider<ZodTypeProvider>();

// Redis
await app.register(fastifyRedis, {
	host: process.env.REDIS_HOST || '127.0.0.1',
	port: Number(process.env.REDIS_PORT) || 6379,
});

app.register(fastifyCookie);

// ETag Control
await app.register(fastifyEtag, { weak: true });

// Caching em memória
await app.register(fastifyCaching, {
	privacy: fastifyCaching.privacy.PUBLIC,
	expiresIn: 60 * 1000, // 1 minuto default
});

// Plugin personalizado cache para validar ETag
await app.register(cachePlugin);

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifyMultipart, { limits: { files: 6 } });

app.setErrorHandler(errorHandler);

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: 'Market Space API',
			description: 'An API from Market Space services',
			version: `${process.env.npm_package_version}`,
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
	},
	transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
	routePrefix: '/docs',
});

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
});

app.register(fastifyCors, {
	origin: '*',
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
});

app.register(routes, { prefix: '/api' });
