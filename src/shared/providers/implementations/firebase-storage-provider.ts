import type { MultipartFile } from '@fastify/multipart/types/index';

export interface IUploadParams {
	file: MultipartFile;
	destination: string;
	makePublic?: boolean;
}

export interface IFirebaseStorageProvider {
	upload(params: IUploadParams): Promise<{ publicUrl: string }>;
}
