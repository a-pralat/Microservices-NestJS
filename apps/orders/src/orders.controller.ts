import {Body, Controller, Get, Post} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderRequestDto } from './dto/create-order.request.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() dto: CreateOrderRequestDto) {
    return this.ordersService.createOrder(dto);
  }

  @Get()
  async getOrders() {
    return this.ordersService.getOrders()
  }
}
