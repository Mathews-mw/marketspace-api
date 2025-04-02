import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IProductProps {
	name: string;
	description: string;
	isNew: boolean;
	price: number;
	acceptTrade: boolean;
	userId: UniqueEntityId;
	isActive: boolean;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class Product extends Entity<IProductProps> {
	get name() {
		return this.props.name;
	}

	set name(name: string) {
		this.name = name;
		this._touch();
	}

	get description() {
		return this.props.description;
	}

	set description(description: string) {
		this.description = description;
		this._touch();
	}

	get isNew() {
		return this.props.isNew;
	}

	set isNew(isNew: boolean) {
		this.isNew = isNew;
		this._touch();
	}

	get price() {
		return this.props.price;
	}

	set price(price: number) {
		this.price = price;
		this._touch();
	}

	get acceptTrade() {
		return this.props.acceptTrade;
	}

	set acceptTrade(acceptTrade: boolean) {
		this.acceptTrade = acceptTrade;
		this._touch();
	}

	get userId() {
		return this.props.userId;
	}

	set userId(userId: UniqueEntityId) {
		this.userId = userId;
		this._touch();
	}

	get isActive() {
		return this.props.isActive;
	}

	set isActive(isActive: boolean) {
		this.isActive = isActive;
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

	static create(props: Optional<IProductProps, 'createdAt' | 'updatedAt'>, id?: UniqueEntityId) {
		const product = new Product({ ...props, createdAt: props.createdAt ?? new Date() }, id);

		return product;
	}
}
