import { UserTokenDetails } from '@app/interface';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';

export enum SocketEventType {
  TASK_CREATED = 'TASK_CREATED',
  TASK_UPDATED = 'TASK_UPDATED',
  TASK_DELETED = 'TASK_DELETED',
}

@WebSocketGateway({ origin: '*' })
export class EventGateway {
  constructor(private authService: AuthService) {}
  @WebSocketServer()
  server: Socket;

  afterInit(server: Socket) {}

  async handleConnection(client: Socket, ...args: any[]) {
    const token: string = client.request.headers?.['authentication'] as string;

    if (!token) {
      client.disconnect();
    } else {
      let user: UserTokenDetails;
      try {
        user = await this.authService.tokenCheck(token);

        client.join(`${user.sub}`);
      } catch (error) {
        client.disconnect();
      }
    }
  }

  async handleDisconnect(client: Socket, ...args: any[]) {
    const token: string = client.request.headers?.['authentication'] as string;
    const user = await this.authService.tokenCheck(token);
    client.leave(`${user?.sub}`);
  }
}
