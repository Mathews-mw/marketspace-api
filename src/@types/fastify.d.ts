import 'fastify';

import { File } from 'fastify-multer/lib/interfaces';

import { Role } from '@/core/auth/roles';

declare module 'fastify' {
	export interface FastifyRequest {
		file: File;

		user: {
			sub: string;
			role: Role;
		};
	}
}
