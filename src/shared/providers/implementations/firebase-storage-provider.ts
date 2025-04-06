export interface IUploadParams {
	fileStream: NodeJS.ReadableStream;
	fileName: string;
	contentType: string;
	makePublic?: boolean;
}

export interface IFirebaseStorageProvider {
	/**
	 * Faz o upload de um arquivo para o Firebase Storage usando streams.
	 *
	 * @param fileStream - O stream de leitura do arquivo;
	 * @param destination - É o destino para onde o arquivo será gravado. O destino contém o nome da pasta + o nome do arquivo;
	 * @param contentType - O tipo de conteúdo do arquivo;
	 * @param makePublic - Tornar o arquivo visível publicamente (Somente para visualização).
	 */
	upload(params: IUploadParams): Promise<{ publicUrl: string }>;
	delete(fileName: string): Promise<void>;
}
