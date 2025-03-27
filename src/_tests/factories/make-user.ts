import { faker } from '@faker-js/faker';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { IUserProps, User } from '@/domains/models/entities/user';

export function makeUser(override: Partial<IUserProps> = {}, id?: UniqueEntityId) {
	const user = User.create(
		{
			name: faker.person.fullName(),
			email: faker.internet.email(),
			password: faker.internet.password(),
			phone: faker.phone.number({ style: 'international' }),
			...override,
		},
		id
	);

	return user;
}
