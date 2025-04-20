import { hash } from 'bcryptjs';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'node:crypto';
import { Prisma, PrismaClient, User } from '@prisma/client';

import cryptographyConfig from '@/config/cryptography-config';

const prisma = new PrismaClient();

async function generateUsers() {
	const hashPassword = await hash('default@password123', cryptographyConfig.HASH_SALT_LENGTH);

	const users: Array<Prisma.UserUncheckedCreateInput> = Array.from({ length: 10 }, (_, i) => {
		return {
			id: randomUUID(),
			name: faker.person.fullName(),
			email: faker.internet.email(),
			phone: faker.phone.number(),
			password: hashPassword,
			role: 'CUSTOMER_SELLER',
			isActive: true,
		};
	});

	return users;
}

async function generateProducts(users: User[]) {
	const userIds = users.map((user) => user.id);
	const paymentsMethods = ['PIX', 'BOLETO', 'DEBITO', 'CREDITO', 'DINHEIRO', 'DEPOSITO'] as const;

	const products: Array<Prisma.ProductUncheckedCreateInput> = Array.from({ length: 100 }, (_, i) => {
		return {
			id: randomUUID(),
			name: faker.commerce.productName(),
			description: faker.commerce.productDescription(),
			isNew: faker.datatype.boolean(),
			price: Number(faker.commerce.price({ min: 5000, max: 250000, dec: 0 })),
			acceptTrade: faker.datatype.boolean(),
			userId: faker.helpers.arrayElement(userIds),
			isActive: true,
			paymentMethods: {
				createMany: {
					skipDuplicates: true,
					data: paymentsMethods.map((item) => {
						return {
							id: randomUUID(),
							type: item,
						};
					}),
				},
			},
			productImages: {
				createMany: {
					skipDuplicates: true,
					data: Array.from({ length: 3 }, (_, i) => {
						const fileName = faker.system.commonFileName('jpg');
						const uniqueName = `${randomUUID()}-${fileName}`;

						return {
							id: randomUUID(),
							fileName: fileName,
							uniqueName: uniqueName,
							url: faker.image.urlPicsumPhotos({ width: 1920, height: 1080, blur: 0 }),
						};
					}),
				},
			},
		};
	});

	return products;
}

async function main() {
	console.log('Delete db registers...');

	await prisma.user.deleteMany();
	await prisma.account.deleteMany();
	await prisma.session.deleteMany();
	await prisma.token.deleteMany();
	await prisma.product.deleteMany();
	await prisma.productImage.deleteMany();
	await prisma.paymentMethod.deleteMany();

	console.log('Start seeding...');

	const users = await generateUsers();

	for (const user of users) {
		const userSeed = await prisma.user.create({
			data: user,
		});

		console.log(`User created: ${userSeed.name}`);

		const accountSeed = await prisma.account.create({
			data: {
				id: randomUUID(),
				userId: userSeed.id,
				provider: 'CREDENTIALS',
				providerAccountId: randomUUID(),
			},
		});

		console.log(`Account created: ${accountSeed.id}`);
	}

	const dbUsers = await prisma.user.findMany();

	const products = await generateProducts(dbUsers);

	for (const product of products) {
		const productSeed = await prisma.product.create({
			data: product,
		});

		console.log(`Product created: ${productSeed.name}`);
	}

	console.log('Seeding Finished!');
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (error) => {
		console.log('Db seed error: ', error);
		await prisma.$disconnect;
		process.exit(1);
	});
