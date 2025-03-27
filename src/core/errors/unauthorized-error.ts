import z from 'zod';

const code = z
	.union([
		z.literal('UNAUTHORIZED_ERROR'),
		z.literal('AUTH_EXPIRED_TOKEN'),
		z.literal('AUTH_INVALID_TOKEN'),
		z.literal('AUTH_INVALID_CREDENTIALS'),
	])
	.default('UNAUTHORIZED_ERROR');

type Code = z.infer<typeof code>;

export class UnauthorizedError extends Error {
	readonly code: Code;

	constructor(message?: string, code?: Code) {
		super(message ?? 'Unauthorized');
		this.code = code ?? 'UNAUTHORIZED_ERROR';

		this.name = 'UnauthorizedError';

		Object.setPrototypeOf(this, UnauthorizedError.prototype);
	}
}
