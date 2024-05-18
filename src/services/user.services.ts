import { User } from '@app/models';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) public userModel: Model<User>) {}

  async createUser(userDetails: Record<string, any>): Promise<any> {
    const { email } = userDetails;
    const userEmailExists = await this.userModel.findOne({ email });

    if (userEmailExists)
      throw new ForbiddenException(
        `${email} already exist, please use a different email`,
      );

    const user = await this.userModel.create(userDetails);
    const { passwordHash, ...rest } = user.toJSON();
    return rest;
  }

  async findUserByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    return user;
  }
}
