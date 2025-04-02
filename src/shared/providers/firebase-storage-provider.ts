import path from 'node:path';
import { cwd } from 'node:process';
import { injectable } from 'tsyringe';
import { getStorage } from 'firebase-admin/storage';
import { cert, initializeApp } from 'firebase-admin/app';

import { IFirebaseStorageProvider, IUploadParams } from './implementations/firebase-storage-provider';

@injectable()
export class FirebaseStorageProvider implements IFirebaseStorageProvider {
	private bucket;

	constructor() {
		var serviceAccount = path.resolve(cwd(), 'market-space-firebase-adminsdk.json');

		initializeApp({
			credential: cert(serviceAccount),
			storageBucket: 'market-space-b8dec.firebasestorage.app',
		});

		const storage = getStorage();
		this.bucket = storage.bucket();
	}

	async upload({ file, destination, makePublic }: IUploadParams) {
		try {
			const bucketFile = this.bucket.file(destination);

			const buffer = await file.toBuffer();

			await bucketFile.save(buffer);

			if (makePublic) {
				await bucketFile.makePublic();
			}

			const publicUrl = bucketFile.publicUrl();
			console.log('publicUrl: ', publicUrl);

			return { publicUrl };
		} catch (error) {
			console.log('Erro ao  tentar fazer upload no storage: ', error);
			throw error;
		}
	}
}
