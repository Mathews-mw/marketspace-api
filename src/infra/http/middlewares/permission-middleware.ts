import { FastifyRequest } from 'fastify';

import { ForbiddenError } from '@/core/errors/forbidden-error';
import { userAuthSchema } from '@/core/auth/models/user-auth-model';
import { Actions, AuthAbility, Entities } from '@/core/auth/auth-ability';

export function verifyUserPermissions(entity: Entities, action: Actions) {
	return async (request: FastifyRequest) => {
		const { sub, role } = request.user;

		const userAuth = userAuthSchema.parse({
			id: sub,
			role,
		});

		const canPerformAction = AuthAbility.canPerformAction(userAuth, action, entity);

		if (!canPerformAction) {
			throw new ForbiddenError('You have no permission to perform this action');
		}
	};
}
