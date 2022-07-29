import { Test, TestingModule } from '@nestjs/testing';
import { InvoicingController } from './invoicing.controller';
import { InvoicingService } from './invoicing.service';

describe('InvoicingController', () => {
  let invoicingController: InvoicingController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [InvoicingController],
      providers: [InvoicingService],
    }).compile();

    invoicingController = app.get<InvoicingController>(InvoicingController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(invoicingController.getHello()).toBe('Hello World!');
    });
  });
});
