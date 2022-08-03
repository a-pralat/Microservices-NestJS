import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderRequestDto } from './dto/create-order.request.dto';
import { OrdersRepository } from './orders.repository';
import { INVOICING_SERVICE } from './constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject(INVOICING_SERVICE) private invoicingClient: ClientProxy,
  ) {}

  async createOrder(dto: CreateOrderRequestDto, authentication: string) {
    const session = await this.ordersRepository.startTransaction();

    try {
      const order = this.ordersRepository.create(dto, { session });
      await lastValueFrom(
        this.invoicingClient.emit('order_created', {
          dto,
          Authentication: authentication,
        }),
      );
      await session.commitTransaction();
      return order;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    }
  }

  async getOrders() {
    return this.ordersRepository.find({});
  }
}
