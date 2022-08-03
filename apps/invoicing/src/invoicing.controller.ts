import { Controller, Get, UseGuards } from '@nestjs/common';
import { InvoicingService } from './invoicing.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { JwtGuard, RmqService } from '@app/common';

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
  @UseGuards(JwtGuard)
  async handleOrderCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.invoicingService.invoice(data);
    this.rmqService.ack(context);
  }
}
