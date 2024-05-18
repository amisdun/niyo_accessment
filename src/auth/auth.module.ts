import { Module } from '@nestjs/common';
import { AuthService } from '@app/auth/auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@app/services';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_ACCESS_TOKEN_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_ACCESS_TOKEN_EXPIRY'),
          },
        };
      },
    }),
  ],
  providers: [AuthService, UserService],
  controllers: [AuthController],
})
export class AuthModule {}
