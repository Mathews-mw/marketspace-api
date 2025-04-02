import { ZodError } from 'zod';
import { FastifyInstance } from 'fastify/types/instance';
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod';

import { ForbiddenError } from '@/core/errors/forbidden-error';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

type FastifyErrorHandler = FastifyInstance['errorHandler'];

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
	if (error instanceof ZodError) {
		return reply.status(400).send({
			message: 'Validation error',
			errors: error.flatten().formErrors,
		});
	}

	if (hasZodFastifySchemaValidationErrors(error)) {
		return reply.status(400).send({
			message: 'Validation Error',
			errors: error.validation.map((error) => error.params.issue),
		});
	}

	if (error instanceof BadRequestError) {
		return reply.status(400).send({
			code: error.code,
			message: error.message,
		});
	}

	if (error instanceof UnauthorizedError) {
		return reply.status(401).send({
			code: error.code,
			message: error.message,
		});
	}

	if (error instanceof ForbiddenError) {
		return reply.status(403).send({
			message: error.message,
		});
	}

	if (error instanceof ResourceNotFoundError) {
		return reply.status(404).send({
			code: error.code,
			message: error.message,
		});
	}

	console.error('Unexpected error: ', error);

	return reply.status(500).send({ message: 'Internal server error' });
};
