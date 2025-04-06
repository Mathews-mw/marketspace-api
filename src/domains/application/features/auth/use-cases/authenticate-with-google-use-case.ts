import ky from 'ky';
import { inject, injectable } from 'tsyringe';

import { env } from '@/env';
import { Outcome, success } from '@/core/outcome';
import { User } from '@/domains/models/entities/user';
import { Account } from '@/domains/models/entities/account';
import { IUserRepository } from '../../users/repositories/user-repository';
import { IAccountRepository } from '../../users/repositories/account-repository';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/containers/dependency-identifiers';

interface IRequest {
	code: string;
}

interface IGoogleTokenResponse {
	access_token: string;
	expires_in: number;
	scope: string;
	token_type: string;
	id_token: string;
}

interface IGoogleUserInfoResponse {
	sub: string;
	name: string;
	given_name: string;
	family_name: string;
	picture: string;
	email: string;
	email_verified: boolean;
}

type Response = Outcome<null, { user: User }>;

@injectable()
export class AuthenticateWithGoogleUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.USERS_REPOSITORY) private usersRepository: IUserRepository,
		@inject(DEPENDENCY_IDENTIFIERS.ACCOUNTS_REPOSITORY) private accountsRepository: IAccountRepository
	) {}

	async execute({ code }: IRequest): Promise<Response> {
		const tokenResponse = await ky
			.post('https://oauth2.googleapis.com/token', {
				json: {
					code,
					client_id: env.GOOGLE_CLIENT_ID,
					client_secret: env.GOOGLE_CLIENT_SECRET,
					redirect_uri: env.GOOGLE_CALLBACK_URL,
					grant_type: 'authorization_code',
				},
			})
			.json<IGoogleTokenResponse>();

		const userInfoResponse = await ky
			.get('https://www.googleapis.com/oauth2/v3/userinfo', {
				headers: {
					Authorization: `Bearer ${tokenResponse.access_token}`,
				},
			})
			.json<IGoogleUserInfoResponse>();

		let user = await this.usersRepository.findByEmail(userInfoResponse.email);

		if (!user) {
			const newUser = User.create({
				name: userInfoResponse.name,
				email: userInfoResponse.email,
				avatar: userInfoResponse.picture,
			});

			await this.usersRepository.create(newUser);

			user = newUser;
		}

		const account = await this.accountsRepository.findUniqueByProvider({
			userId: user.id.toString(),
			provider: 'GOOGLE',
		});

		if (!account) {
			const newAccount = Account.create({
				userId: user.id,
				provider: 'GOOGLE',
				providerAccountId: userInfoResponse.sub,
			});

			await this.accountsRepository.create(newAccount);
		}

		return success({
			user,
		});
	}
}
