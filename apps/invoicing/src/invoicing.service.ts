import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class InvoicingService {
  private readonly logger = new Logger(InvoicingService.name);

  getHello(): string {
    return 'Hello World!';
  }

  invoice(data: any) {
    this.logger.log('Invoicing...', data);
  }
}
