import z from 'zod';
import process from 'node:process';

process.loadEnvFile('.env');

export const envSchema = z.object({
	NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
	PORT: z.coerce.number().default(3333),
	HOST: z.string(),
	DATABASE_URL: z.string(),
	JWT_SECRET: z.string(),
	GOOGLE_CLIENT_ID: z.string(),
	GOOGLE_CLIENT_SECRET: z.string(),
	GOOGLE_CALLBACK_URL: z.string().url(),
	REDIS_HOST: z.string().default('127.0.0.1'),
	REDIS_PORT: z.coerce.number().default(6379),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
	console.log('❌ Invalid environment variables:', _env.error.format());

	throw new Error('Invalid environment variables');
}

export const env = _env.data;
