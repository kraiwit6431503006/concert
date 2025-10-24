import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { CreateConcertDto } from './dto/create-concert.dto';
import { UpdateConcertDto } from './dto/update-concert.dto';

@Controller('concerts')
export class ConcertsController {
  constructor(private readonly concertsService: ConcertsService) {}

  @Post()
  async create(@Body() createConcertDto: CreateConcertDto) {
    return this.concertsService.create(createConcertDto);
  }

  @Get()
  findAll() {
    return this.concertsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.concertsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateConcertDto: UpdateConcertDto,
  ) {
    return this.concertsService.update(id, updateConcertDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.concertsService.delete(id);
  }
}
