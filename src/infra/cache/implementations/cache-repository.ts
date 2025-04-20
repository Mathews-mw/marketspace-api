export interface ISetCache {
	key: string;
	value: unknown;
	ttl?: number;
}

export interface ICacheRepository {
	/** ttl => Tempo de validade do cache. Definido em segundos. Por padrão será definido em 5 minutos*/
	set(data: ISetCache): Promise<void>;
	get<T>(key: string): Promise<T | null>;
	delete(key: string): Promise<void>;
}
