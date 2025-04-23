import { Prisma } from '@prisma/client';
import { injectable } from 'tsyringe';

import { prisma } from '../prisma';
import { Product } from '@/domains/models/entities/product';
import { ProductMapper } from '../mappers/product/product-mapper';
import { ProductInfoMapper } from '../mappers/product/product-info-mapper';
import { ProductDetailsMapper } from '../mappers/product/product-details-mapper';
import {
	IProductByUserQuerySearch,
	IProductCursorResponse,
	IProductQuerySearch,
	IProductQuerySearchWithCursor,
	IProductRepository,
} from '@/domains/application/features/products/repositories/product-repository';

@injectable()
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
					user: true,
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

	async findManyWithCursor({
		limit,
		cursor,
		skip,
		userId,
		search,
		isNew,
		acceptTrade,
		paymentMethods,
	}: IProductQuerySearchWithCursor): Promise<IProductCursorResponse> {
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

		const products = await prisma.product.findMany({
			where: query.where,
			include: {
				paymentMethods: true,
				productImages: true,
				user: true,
			},
			skip,
			take: limit + 1, // basicamente, pega o limite mais um elemento. Esse elemento extra será usado como cursor.
			cursor: cursor
				? {
						id: cursor, // este cursor será definido automaticamente pela última consulta e será indefinido na primeira query.
					}
				: undefined,
			orderBy: {
				createdAt: 'desc',
			},
		});

		let nextCursor: string | undefined;
		let previousCursor: string | undefined;
		let stillHaveData = true;

		// Se a resposta da consulta for maior que o limite, significa que há mais itens a serem buscados. É por isso que pegamos os elementos limit+1.
		if (products.length > limit) {
			stillHaveData = true;
			previousCursor = products[0].id;

			const nextItem = products.pop(); // Retorna o último item da array e também o remove dessa array.
			nextCursor = nextItem?.id;
		} else {
			stillHaveData = false;
		}

		return {
			products: products.map(ProductInfoMapper.toDomain),
			nextCursor,
			previousCursor,
			stillHaveData,
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
			products: products.map(ProductInfoMapper.toDomain),
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
