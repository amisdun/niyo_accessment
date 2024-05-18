import { Module } from '@nestjs/common';
import { PaginationService, TaskServices, UserService } from '@app/services';
import { TaskController } from '@app/controller';
import { JwtService } from '@nestjs/jwt';
import { EventGateway } from '@app/services/sockets.services';
import { AuthService } from '@app/auth/auth.service';

@Module({
  imports: [],
  controllers: [TaskController],
  providers: [
    TaskServices,
    PaginationService,
    JwtService,
    EventGateway,
    AuthService,
    UserService,
  ],
})
export class TaskModule {}
