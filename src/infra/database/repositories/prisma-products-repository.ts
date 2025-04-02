import { prisma } from '../prisma';
import { ProductMapper } from '../mappers/product-mapper';
import { Product } from '@/domains/models/entities/product';
import {
	IProductQuerySearch,
	IProductRepository,
} from '@/domains/application/features/products/repositories/product-repository';

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

	async findManyByUser({ userId }: IProductQuerySearch) {
		const products = await prisma.product.findMany({
			where: {
				userId,
			},
		});

		return products.map(ProductMapper.toDomain);
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
		});

		if (!product) {
			return null;
		}

		return ProductMapper.toDomain(product);
	}
}
