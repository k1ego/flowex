import { Query, Resolver } from '@nestjs/graphql'

import { AccountService } from './account.service'
import { UserModel } from './models/user.models'

@Resolver('Account')
export class AccountResolver {
	public constructor(private readonly accountService: AccountService) {}

	@Query(() => [UserModel], { name: 'findAllUsers' })
	public async findAll() {
		return this.accountService.findAll()
	}
}
	
