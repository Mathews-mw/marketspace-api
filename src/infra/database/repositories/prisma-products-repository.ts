import { prisma } from '../prisma';
import { ProductMapper } from '../mappers/product/product-mapper';
import { Product } from '@/domains/models/entities/product';
import {
	IProductByUserQuerySearch,
	IProductQuerySearch,
	IProductRepository,
} from '@/domains/application/features/products/repositories/product-repository';
import { ProductInfoMapper } from '../mappers/product/product-info-mapper';
import { Prisma } from '@prisma/client';
import { ProductDetailsMapper } from '../mappers/product/product-details-mapper';

export class PrismaProductsRepository implements IProductRepository {
	async create(product: Product) {
		const data = ProductMapper.toPrisma(product);

		await prisma.product.create({
			data,
		});

		return product;
	}

	async update(product: Product) {
		const data = ProductMapper.toPrisma(product);

		await prisma.product.update({
			data,
			where: {
				id: data.id,
			},
		});

		return product;
	}

	async delete(product: Product) {
		await prisma.product.delete({
			where: {
				id: product.id.toString(),
			},
		});
	}

	async findMany({ userId, search, isNew, acceptTrade, paymentMethods }: IProductQuerySearch) {
		const query: Prisma.ProductFindManyArgs = {
			where: {
				userId,
				name: search,
				isNew,
				acceptTrade,
				paymentMethods: {
					some: {
						type: {
							in: paymentMethods,
						},
					},
				},
			},
		};

		const [products, amount] = await prisma.$transaction([
			prisma.product.findMany({
				where: query.where,
				include: {
					paymentMethods: true,
					productImages: true,
				},
			}),
			prisma.product.count({
				where: query.where,
			}),
		]);

		return {
			amount,
			products: products.map(ProductInfoMapper.toDomain),
		};
	}

	async findManyByUser({ userId, search, isNew, acceptTrade, paymentMethods }: IProductByUserQuerySearch) {
		const query: Prisma.ProductFindManyArgs = {
			where: {
				userId,
				name: search,
				isNew,
				acceptTrade,
				paymentMethods: {
					some: {
						type: {
							in: paymentMethods,
						},
					},
				},
			},
		};

		const [products, amount] = await prisma.$transaction([
			prisma.product.findMany({
				where: query.where,
				include: {
					user: true,
					productImages: true,
					paymentMethods: true,
				},
			}),
			prisma.product.count({
				where: query.where,
			}),
		]);

		return {
			amount,
			products: products.map(ProductDetailsMapper.toDomain),
		};
	}

	async findById(id: string) {
		const product = await prisma.product.findUnique({
			where: {
				id,
			},
		});

		if (!product) {
			return null;
		}

		return ProductMapper.toDomain(product);
	}

	async findDetails(id: string) {
		const product = await prisma.product.findUnique({
			where: {
				id,
			},
			include: {
				user: true,
				productImages: true,
				paymentMethods: true,
			},
		});

		if (!product) {
			return null;
		}

		return ProductDetailsMapper.toDomain(product);
	}
}
