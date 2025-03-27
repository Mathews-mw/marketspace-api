import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IProductImageProps {
	title: string;
	url: string;
	productId: UniqueEntityId;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class ProductImage extends Entity<IProductImageProps> {
	get title() {
		return this.props.title;
	}

	set title(title: string) {
		this.props.title = title;
		this._touch();
	}

	get url() {
		return this.props.url;
	}

	set url(url: string) {
		this.props.url = url;
		this._touch();
	}

	get productId() {
		return this.props.productId;
	}

	set productId(productId: UniqueEntityId) {
		this.props.productId = productId;
		this._touch();
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	private _touch() {
		this.props.updatedAt = new Date();
	}

	static create(props: Optional<IProductImageProps, 'createdAt' | 'updatedAt'>, id?: UniqueEntityId) {
		const productImage = new ProductImage({ ...props, createdAt: props.createdAt ?? new Date() }, id);

		return productImage;
	}
}
