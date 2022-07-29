import { NestFactory } from '@nestjs/core';
import { InvoicingModule } from './invoicing.module';
import { RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(InvoicingModule);

  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('INVOICING'));
  await app.startAllMicroservices();
}
bootstrap();
