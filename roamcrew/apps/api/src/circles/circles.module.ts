import { Module } from '@nestjs/common';
import { CirclesService } from './circles.service';
import { CirclesController } from './circles.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CirclesService],
  controllers: [CirclesController],
  exports: [CirclesService],
})
export class CirclesModule {}
