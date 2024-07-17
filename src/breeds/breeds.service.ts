import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Breed } from './entities/breed.entity';
import { Repository } from 'typeorm';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { Role } from 'src/common/enums/rol.enum';
import { Cat } from 'src/cats/entities/cat.entity';
import { CreateCatDto } from 'src/cats/dto/create-cat.dto';

@Injectable()
export class BreedsService {
  constructor(
    @InjectRepository(Breed)
    private readonly breedRepository: Repository<Breed>,
  ) {}
  async create(createBreedDto: CreateBreedDto, user: UserActiveInterface) {
    const existingBreed = await this.breedRepository.findOne({
      where: { name: createBreedDto.name },
    });
    if (existingBreed) {
      throw new BadRequestException('Breed is already created');
    }

    return await this.breedRepository.save({
      ...createBreedDto,
      userEmail: user.email,
    });
  }

  async findAll(user: UserActiveInterface) {
    return await this.breedRepository.find({
      where: { userEmail: user.email },
    });
  }

  async findOne(id: number, user: UserActiveInterface) {
    const breed = await this.breedRepository.findOneBy({
      id,
      userEmail: user.email,
    });
    if (!breed) {
      throw new BadRequestException('Breed hasnt been found');
    }

    return breed;
  }

  async update(
    id: number,
    updateBreedDto: UpdateBreedDto,
    user: UserActiveInterface,
  ) {
    await this.findOne(id, user);
    return await this.breedRepository.update(id, {
      ...updateBreedDto,
      userEmail: user.email,
    });
  }

  async remove(id: number, user: UserActiveInterface) {
    await this.findOne(id, user);
    return await this.breedRepository.softDelete({ id });
  }
}
