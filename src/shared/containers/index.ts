import { container } from 'tsyringe';

import { DependencyIdentifiers } from './dependency-identifiers';
import { FirebaseStorageProvider } from '../providers/firebase-storage-provider';
import { PrismaUsersRepository } from '@/infra/database/repositories/prisma-users-repository';
import { PrismaAccountsRepository } from '@/infra/database/repositories/prisma-accounts-repository';
import { PrismaProductsRepository } from '@/infra/database/repositories/prisma-products-repository';
import { PrismaSessionsRepository } from '@/infra/database/repositories/prisma-sessions-repository';
import { PrismaProductImagesRepository } from '@/infra/database/repositories/prisma-product-images-repository';
import { PrismaPaymentMethodsRepository } from '@/infra/database/repositories/prisma-payment-methods-repository';

function registerSingleton<T>(identifier: DependencyIdentifiers, implementation: new (...args: any[]) => T) {
	container.registerSingleton(identifier, implementation);
}

registerSingleton('UsersRepository', PrismaUsersRepository);
registerSingleton('AccountsRepository', PrismaAccountsRepository);
registerSingleton('SessionsRepository', PrismaSessionsRepository);
registerSingleton('ProductsRepository', PrismaProductsRepository);
registerSingleton('ProductImagesRepository', PrismaProductImagesRepository);
registerSingleton('PaymentMethodsRepository', PrismaPaymentMethodsRepository);

registerSingleton('FirebaseStorageProvider', FirebaseStorageProvider);
