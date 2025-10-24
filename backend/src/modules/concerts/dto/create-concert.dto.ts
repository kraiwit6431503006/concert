import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateConcertDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNumber({}, { message: 'Capacity must be a number' })
  @Min(1, { message: 'Capacity must be at least 1' })
  capacity: number;

  @IsOptional()
  @IsString()
  description?: string;
}
