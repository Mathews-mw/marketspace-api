import { User } from '@/domains/models/entities/user';

export class UserPresenter {
	static toHTTP(data: User) {
		return {
			id: data.id.toString(),
			name: data.name,
			email: data.email,
			phone: data.phone ?? null,
			role: data.role,
			avatar: data.avatar ?? null,
			is_active: data.isActive,
			created_at: data.createdAt,
		};
	}
}
