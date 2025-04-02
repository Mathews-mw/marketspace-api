import fs from 'node:fs';
import path from 'node:path';
import { cwd } from 'node:process';
import { FastifyRequest } from 'fastify';
import type { MultipartFile } from '@fastify/multipart';

import { BadRequestError } from '@/core/errors/bad-request-errors';

interface IBodyRequest {
	file: Array<MultipartFile>;
}

export async function uploadPreHandler(request: FastifyRequest) {
	console.log('PRE HANDLER | request body: ', request.body);
	// console.log('PRE HANDLER |  request file: ', request.file);

	const bodyData = (await request.body) as IBodyRequest | undefined;

	if (!bodyData) {
		throw new BadRequestError('Please, provide a file');
	}

	const files = bodyData.file;

	try {
		// if (files) {
		// 	for (const file of files) {
		// 		const bufferFile = await file.toBuffer();
		// 		console.log('PRE HANDLER | bufferFile: ', bufferFile);
		// 		// const fileName = `${Date.now()}_${file.filename}`;
		// 		// const filePath = path.resolve(cwd(), 'tmp', 'uploads', fileName);
		// 		// await fs.writeFileSync(filePath, bufferFile);
		// 	}
		// }
	} catch (error) {
		console.log('Upload Pre Handler Error: ', error);
		throw error;
	}
}
