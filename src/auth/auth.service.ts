/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '@app/models';
import { UserTokenDetails } from '@app/interface';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, SignUpDto } from '@app/dto';
import { UserService } from '@app/services/user.services';
import { EventGateway } from '@app/services/sockets.services';
const logger = new Logger('auth.service');

@Injectable()
export class AuthService {
  SALT_LEVEL = 10;

  constructor(
    public userService: UserService,
    public jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<any> {
    const { password, confirmPassword, ...rest } = signUpDto;
    const passwordHash = await bcrypt.hash(password, this.SALT_LEVEL);
    const userDetails = {
      ...rest,
      passwordHash,
    };
    return this.userService.createUser(userDetails);
  }

  public async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;

    try {
      const user = await this.userService.findUserByEmail(email);

      const passwordMatch = await this.validatePassword(
        password,
        user.passwordHash,
      );

      if (!passwordMatch)
        throw new UnauthorizedException('Invalid email or password');

      return await this.generateToken(user);
    } catch (error) {
      logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async generateToken(user: User): Promise<string> {
    const payload: UserTokenDetails = {
      sub: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  public async tokenCheck(token: string): Promise<any> {
    return await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    });
  }

  async validatePassword(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    const isPasswordValid = await bcrypt.compare(password, passwordHash);
    return isPasswordValid;
  }
}
