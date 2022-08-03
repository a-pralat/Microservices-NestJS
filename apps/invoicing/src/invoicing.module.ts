import { Module } from '@nestjs/common';
import { InvoicingController } from './invoicing.controller';
import { InvoicingService } from './invoicing.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule, RmqModule } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RmqModule,
    AuthModule,
  ],
  controllers: [InvoicingController],
  providers: [InvoicingService],
})
export class InvoicingModule {}
