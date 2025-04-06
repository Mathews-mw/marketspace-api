import { Product } from '@/domains/models/entities/product';
import { ProductImage } from '@/domains/models/entities/product-image';

export class ProductImagePresenter {
	static toHTTP(data: ProductImage) {
		return {
			id: data.id.toString(),
			product_id: data.productId.toString(),
			file_name: data.fileName,
			unique_name: data.uniqueName,
			url: data.url,
		};
	}
}
