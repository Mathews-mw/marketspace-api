/** Monta chave única por rota + parâmetros */
export function makeCacheKey(route: string, params: Record<string, string | number | undefined>) {
	const qs = Object.entries(params)
		.filter(([, v]) => v != null)
		.map(([k, v]) => `${k}=${v}`)
		.join('&');
	return `cache:${route}${qs ? '?' + qs : ''}`;
}
