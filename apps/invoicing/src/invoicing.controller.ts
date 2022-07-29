import { Controller, Get } from '@nestjs/common';
import { InvoicingService } from './invoicing.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Controller()
export class InvoicingController {
  constructor(
    private readonly invoicingService: InvoicingService,
    private readonly rmqService: RmqService,
  ) {}

  @Get()
  getHello(): string {
    return this.invoicingService.getHello();
  }

  @EventPattern('order_created')
  async handleOrderCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.invoicingService.invoice(data);
    this.rmqService.ack(context);
  }
}
