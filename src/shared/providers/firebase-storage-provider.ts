import path from 'node:path';
import { cwd } from 'node:process';
import { injectable } from 'tsyringe';
import { promisify } from 'node:util';
import { pipeline } from 'node:stream';
import { getStorage } from 'firebase-admin/storage';
import { cert, initializeApp } from 'firebase-admin/app';

import firebaseConfig from '@/config/firebase-config';
import { IFirebaseStorageProvider, IUploadParams } from './implementations/firebase-storage-provider';

@injectable()
export class FirebaseStorageProvider implements IFirebaseStorageProvider {
	private bucket;

	constructor() {
		var serviceAccount = path.resolve(cwd(), 'service-account-key.json');

		initializeApp({
			credential: cert(serviceAccount),
			storageBucket: 'market-space-b8dec.firebasestorage.app',
		});

		const storage = getStorage();
		this.bucket = storage.bucket();
	}

	async upload({ fileStream, fileName, contentType, makePublic }: IUploadParams) {
		const pump = promisify(pipeline);

		try {
			const bucketFile = this.bucket.file(`${firebaseConfig.folders.FILES}/${fileName}`);

			const writeStream = bucketFile.createWriteStream({
				metadata: {
					contentType: contentType,
				},
			});

			await pump(fileStream, writeStream);

			if (makePublic) {
				await bucketFile.makePublic();
			}

			const publicUrl = bucketFile.publicUrl();

			console.log('provider publicUrl: ', publicUrl);

			return { publicUrl };
		} catch (error) {
			console.log('Erro ao  tentar fazer upload no storage: ', error);
			throw error;
		}
	}

	async delete(fileName: string) {
		const bucketFile = this.bucket.file(`${firebaseConfig.folders.FILES}/${fileName}`);

		const [exists] = await bucketFile.exists();

		if (!exists) {
			console.log(`File ${fileName} does not exist`);
			return;
		}

		try {
			await bucketFile.delete();
		} catch (error) {
			console.error(`Erro ao tentar deletar o arquivo ${fileName} no storage:`, error);
		}
	}
}
