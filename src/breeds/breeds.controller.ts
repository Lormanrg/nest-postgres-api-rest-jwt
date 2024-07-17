import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BreedsService } from './breeds.service';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';
import { Auth } from 'src/auth/decorators/auth.decorators';
import { Role } from 'src/common/enums/rol.enum';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { ActiveUser } from 'src/common/decorators/active-user.decorators';

@Auth(Role.ADMIN)
@Controller('breeds')
export class BreedsController {
  constructor(private readonly breedsService: BreedsService) {}

  @Post()
  create(
    @Body() createBreedDto: CreateBreedDto,

    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.breedsService.create(createBreedDto, user);
  }

  @Get()
  findAll(@ActiveUser() user: UserActiveInterface) {
    return this.breedsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @ActiveUser() user: UserActiveInterface) {
    return this.breedsService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateBreedDto: UpdateBreedDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.breedsService.update(id, updateBreedDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @ActiveUser() user: UserActiveInterface) {
    return this.breedsService.remove(id, user);
  }
}
