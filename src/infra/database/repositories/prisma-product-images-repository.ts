import { prisma } from '../prisma';
import { ProductImageMapper } from '../mappers/product-image-mapper';
import { ProductImage } from '@/domains/models/entities/product-image';
import { IProductImageRepository } from '@/domains/application/features/product-images/repositories/product-image-repository';

export class PrismaProductImagesRepository implements IProductImageRepository {
	async create(productImage: ProductImage) {
		const data = ProductImageMapper.toPrisma(productImage);

		await prisma.productImage.create({
			data,
		});

		return productImage;
	}

	async update(productImage: ProductImage) {
		const data = ProductImageMapper.toPrisma(productImage);

		await prisma.productImage.update({
			data,
			where: {
				id: data.id,
			},
		});

		return productImage;
	}

	async delete(productImage: ProductImage) {
		await prisma.productImage.delete({
			where: {
				id: productImage.id.toString(),
			},
		});
	}

	async findManyByProduct(productId: string) {
		const productImages = await prisma.productImage.findMany({
			where: {
				productId,
			},
		});

		return productImages.map(ProductImageMapper.toDomain);
	}

	async findById(id: string) {
		const productImage = await prisma.productImage.findUnique({
			where: {
				id,
			},
		});

		if (!productImage) {
			return null;
		}

		return ProductImageMapper.toDomain(productImage);
	}
}
