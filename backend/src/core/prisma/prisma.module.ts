import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// делает модуль доступным во всём приложении без необходимости импортировать его в другие модули.
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
