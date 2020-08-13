import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { hashSync } from 'bcryptjs';
import { PublicProfile, PrivateProfile } from './types';
import { UserNotFoundException } from './exceptions/UserNotFound';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /** @deprecated */
  public findById(id: string): Promise<User> {
    return this.usersRepository.findOneOrFail(id);
  }

  /** @deprecated */
  public findByUsername(username: string): Promise<User> {
    return this.usersRepository.findOneOrFail({ username: username });
  }

  /**
   * Returns a user's profile, which is a subset of the User entity.
   *
   * @param userId The user whose profile will be returned.
   */
  public async getPublicProfile(userId: string): Promise<PublicProfile> {
    try {
      // TODO do this with query builder
      const user = await this.usersRepository.findOneOrFail(userId);

      return {
        username: user.username,
        id: user.id,
      };
    } catch (error) {
      throw new UserNotFoundException(userId);
    }
  }

  /**
   * Returns a user's private profile, which is a subset of User entity.
   *
   * @param userId The user whose profile will be returned.
   */
  public async getPrivateProfile(userId: string): Promise<PrivateProfile> {
    try {
      // TODO do this with query builder
      const user = await this.usersRepository.findOneOrFail(userId);

      return {
        username: user.username,
        id: user.id,
        email: user.email,
      };
    } catch (error) {
      throw new UserNotFoundException(userId);
    }
  }

  /**
   * Creates a new user and saves it in the database.
   *
   * @param createUserDto transfer object containing data to register an user
   */
  public async create(createUserDto: CreateUserDTO): Promise<PrivateProfile> {
    // TODO do this in a more idiomatic way

    let newUser = new User();
    newUser.username = createUserDto.username;
    newUser.password = hashSync(createUserDto.password, 13);
    newUser.email = createUserDto.email;
    newUser.comments = [];
    newUser.posts = [];

    newUser = await this.usersRepository.save(newUser);
    return {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
    };
  }
}
