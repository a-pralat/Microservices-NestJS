import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateOrderRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsPositive()
  price: number;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phoneNumber: string;
}
