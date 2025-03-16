import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { verify } from 'argon2'
import type { Request } from 'express'

import { PrismaService } from '@/src/core/prisma/prisma.service'

import { LoginInput } from './inputs/login.input'
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util'

@Injectable()
export class SessionService {
	public constructor(
		private readonly prismaService: PrismaService,

		private readonly configService: ConfigService
	) {}

	public async login(req: Request, input: LoginInput, userAgent: string) {
		const { login, password } = input

		const user = await this.prismaService.user.findFirst({
			where: {
				OR: [
					{
						username: { equals: login }
					},
					{
						email: { equals: login }
					}
				]
			}
		})

		if (!user) {
			throw new NotFoundException('Пользователь не найден')
		}

		const isPasswordValid = await verify(user.password, password)

		if (!isPasswordValid) {
			throw new UnauthorizedException('Неверный пароль')
		}

		const metadata = getSessionMetadata(req, userAgent)

		return new Promise((resolve, reject) => {
			req.session.createdAt = new Date()
			req.session.userId = user.id
			req.session.metadata = metadata
			
			req.session.save(err => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							'Не удалось сохранить сессию, повторите попытку позже'
						)
					)
				}
				resolve(user)
			})
		})
	}

	public async logout(req: Request) {
		return new Promise((resolve, reject) => {
			req.session.destroy(err => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							'Не удалось завершить сессию, повторите попытку позже'
						)
					)
				}
				req.res.clearCookie(
					this.configService.getOrThrow<string>('SESSION_NAME')
				)
				resolve(true)
			})
		})
	}
}
