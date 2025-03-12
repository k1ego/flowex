// управления подключением к базе данных с помощью Prisma 

import { Injectable, type OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	// при инициализации модуля будет устанавливаться соеденинение с бд
	public async onModuleInit() {
		await this.$connect()
	}

	// при разрешении модуля, здесь разрывается связь с бд
	public async onModuleDestroy() {
		await this.$disconnect()
	}
}
