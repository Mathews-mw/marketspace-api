export interface ISetETagCache {
	key: string;
	payload: Object;
	latest: number;
	ttl?: number;
}

export interface IETagCacheRepository {
	/**
	 * latest => Timestamp mais recente para gerar a ETAG. Usar os campos `updatedAt` (caso esteja preenchido) ou `createdAt`
	 *
	 * ttl => Tempo de validade do cache. Definido em segundos. Por padrão será definido em 5 minutos
	 */
	setCache(data: ISetETagCache): Promise<{ etag: string }>;
}
