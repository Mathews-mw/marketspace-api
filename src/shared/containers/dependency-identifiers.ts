export const DEPENDENCY_IDENTIFIERS = {
	FIREBASE_STORAGE_PROVIDER: 'FirebaseStorageProvider',
	USERS_REPOSITORY: 'UsersRepository',
	ACCOUNTS_REPOSITORY: 'AccountsRepository',
	PRODUCTS_REPOSITORY: 'ProductsRepository',
} as const;

export type DependencyIdentifiers = (typeof DEPENDENCY_IDENTIFIERS)[keyof typeof DEPENDENCY_IDENTIFIERS];
