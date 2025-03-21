import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'

import { UserModel } from '../account/models/user.models'

import type { GqlContext } from './inputs/gql-context.types'
import { LoginInput } from './inputs/login.input'
import { SessionService } from './session.service'
import { UserAgent } from '@/src/shared/decorators/user-agent.decorators'

@Resolver('Session')
export class SessionResolver {
	public constructor(private readonly sessionService: SessionService) {}

	@Mutation(() => UserModel, { name: 'loginUser' })
	public async login(
		@Context() { req }: GqlContext,
		@Args('data') input: LoginInput,
		@UserAgent() userAgent: string
	) {
		return this.sessionService.login(req, input, userAgent)
	}

	@Mutation(() => Boolean, { name: 'logoutUser' })
	public async logout(@Context() { req }: GqlContext) {
		return this.sessionService.logout(req)
	}
}
