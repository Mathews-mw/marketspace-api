export const DEPENDENCY_IDENTIFIERS = {
	FIREBASE_STORAGE_PROVIDER: 'FirebaseStorageProvider',
	USERS_REPOSITORY: 'UsersRepository',
	SESSIONS_REPOSITORY: 'SessionsRepository',
	ACCOUNTS_REPOSITORY: 'AccountsRepository',
	PRODUCTS_REPOSITORY: 'ProductsRepository',
	PRODUCT_IMAGES_REPOSITORY: 'ProductImagesRepository',
	PAYMENT_METHODS_REPOSITORY: 'PaymentMethodsRepository',
	CACHE_REPOSITORY: 'CacheRepository',
	ETAG_CACHE_REPOSITORY: 'ETagCacheRepository',
} as const;

export type DependencyIdentifiers = (typeof DEPENDENCY_IDENTIFIERS)[keyof typeof DEPENDENCY_IDENTIFIERS];
