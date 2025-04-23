import 'fastify';

import { File } from 'fastify-multer/lib/interfaces';

import { Role } from '@/core/auth/roles';

interface ICacheOpts {
	/** Prefixo de rota para gerar a chave */
	route: string;
	/** Parâmetros de req.query e/ou req.params a considerar na chave */
	pickParams?: (req: FastifyRequest) => Record<string, any>;
	/** Tempo de vida em segundos no Redis */
	ttl?: number;
}

declare module 'fastify' {
	export interface FastifyRequest {
		file: File;

		user: {
			sub: string;
			role: Role;
		};
	}
}
