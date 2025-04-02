import { MultipartFile } from '@fastify/multipart';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function productController(request: FastifyRequest, reply: FastifyReply) {
	console.log('request files: ', request.files);
	try {
		const parts = request.files();
		const files: MultipartFile[] = [];

		for await (const part of parts) {
			files.push(part);
			// await storageProvider.upload(part);
		}

		console.log('All files: ', files);

		return reply.status(200).send({ message: 'OK' });
	} catch (error) {
		console.log('Unexpected error: ', error);
		return reply.status(400).send({ message: 'Deu ruim aqui...' });
	}
}
