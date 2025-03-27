import { Product } from '@/domains/models/entities/product';

export interface IProductQuerySearch {
	userId: string;
	search?: string;
}

export interface IFindUniqueParams {
	id?: string;
	email?: string;
}

export interface IProductRepository {
	create(product: Product): Promise<Product>;
	update(product: Product): Promise<Product>;
	delete(product: Product): Promise<void>;
	findManyByUser(query: IProductQuerySearch): Promise<Product[]>;
	findById(id: string): Promise<Product | null>;
	findDetails(id: string): Promise<Product | null>;
}
