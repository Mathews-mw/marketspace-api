import z from 'zod';
import { Role } from './roles';
import { UserAuth } from './models/user-auth-model';

const entities = z.union([
	z.literal('User'),
	z.literal('Product'),
	z.literal('ProductImage'),
	z.literal('PaymentMethod'),
]);
export type Entities = z.infer<typeof entities>;

const actions = z.union([z.literal('create'), z.literal('read'), z.literal('update'), z.literal('delete')]);
export type Actions = z.infer<typeof actions>;

export type PermissionsMap = Record<Role, Record<Entities, Actions[]>>;

export const rolePermissions: PermissionsMap = {
	ADMIN: {
		User: ['create', 'read', 'update', 'delete'],
		Product: ['create', 'read', 'update', 'delete'],
		ProductImage: ['create', 'read', 'update', 'delete'],
		PaymentMethod: ['create', 'read', 'update', 'delete'],
	},

	CUSTOMER: {
		User: ['read', 'update'],
		Product: ['read'],
		ProductImage: ['read'],
		PaymentMethod: ['read'],
	},

	CUSTOMER_SELLER: {
		User: ['read', 'update'],
		Product: ['create', 'read', 'update', 'delete'],
		ProductImage: ['create', 'read', 'update', 'delete'],
		PaymentMethod: ['create', 'read', 'update', 'delete'],
	},
};

export class AuthAbility {
	static canPerformAction(user: UserAuth, action: Actions, entity: Entities): boolean {
		const permissions = rolePermissions[user.role] || {};
		const allowedActions = permissions[entity] || [];
		return allowedActions.includes(action);
	}
}
