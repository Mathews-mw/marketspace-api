import { Role } from '@/core/auth/roles';
import { Entity } from '@/core/entities/entity';
import { Optional } from '@/core/types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export interface IUserProps {
	name: string;
	email: string;
	phone?: string | null;
	password?: string | null;
	role: Role;
	avatar?: string | null;
	isActive: boolean;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class User extends Entity<IUserProps> {
	get name() {
		return this.props.name;
	}

	set name(name: string) {
		this.props.name = name;
		this._touch();
	}

	get email() {
		return this.props.email;
	}

	set email(email: string) {
		this.props.email = email;
		this._touch();
	}

	get phone() {
		return this.props.phone;
	}

	set phone(phone: string | null | undefined) {
		this.props.phone = phone;
		this._touch();
	}

	get password() {
		return this.props.password;
	}

	set password(password: string | null | undefined) {
		this.props.password = password;
		this._touch();
	}

	get role() {
		return this.props.role;
	}

	set role(role: Role) {
		this.props.role = role;
		this._touch();
	}

	get avatar() {
		return this.props.avatar;
	}

	set avatar(avatar: string | undefined | null) {
		this.props.avatar = avatar;
		this._touch();
	}

	get isActive() {
		return this.props.isActive;
	}

	set isActive(isActive: boolean) {
		this.props.isActive = isActive;
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

	static create(props: Optional<IUserProps, 'role' | 'isActive' | 'createdAt' | 'updatedAt'>, id?: UniqueEntityId) {
		const user = new User(
			{
				...props,
				role: props.role ?? 'CUSTOMER',
				isActive: props.isActive ?? true,
				createdAt: props.createdAt ?? new Date(),
			},
			id
		);

		return user;
	}
}
