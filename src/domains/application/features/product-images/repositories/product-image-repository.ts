import { ProductImage } from '@/domains/models/entities/product-image';

export interface IFindUniqueParams {
	id?: string;
	email?: string;
}

export interface IProductImageRepository {
	create(productImage: ProductImage): Promise<ProductImage>;
	update(productImage: ProductImage): Promise<ProductImage>;
	delete(productImage: ProductImage): Promise<void>;
	findManyByProduct(productId: string): Promise<ProductImage[]>;
	findById(id: string): Promise<ProductImage | null>;
}
