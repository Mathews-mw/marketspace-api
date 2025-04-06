import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IProductImageProps {
	fileName: string;
	uniqueName: string;
	url: string;
	productId: UniqueEntityId;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class ProductImage extends Entity<IProductImageProps> {
	get fileName() {
		return this.props.fileName;
	}

	set fileName(fileName: string) {
		this.props.fileName = fileName;
		this._touch();
	}

	get uniqueName() {
		return this.props.uniqueName;
	}

	set uniqueName(uniqueName: string) {
		this.props.uniqueName = uniqueName;
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
