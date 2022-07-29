import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderRequestDto } from './dto/create-order.request.dto';
import { OrdersRepository } from './orders.repository';
import { INVOICING_SERVICE } from './constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {Order} from "./schemas/order.schema";

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject(INVOICING_SERVICE) private invoicingClient: ClientProxy,
  ) {}

  async createOrder(dto: CreateOrderRequestDto):Promise<Order> {
    const session = await this.ordersRepository.startTransaction();

    try {
      const order = this.ordersRepository.create(dto, { session });
      await lastValueFrom(
        this.invoicingClient.emit('order_created', {
          dto,
        }),
      );
      await session.commitTransaction();
      return order;
    } catch (exception) {
      await session.abortTransaction();
      throw exception;
    }
  }

  async getOrders() {
    return this.ordersRepository.findAll({});
  }
}
