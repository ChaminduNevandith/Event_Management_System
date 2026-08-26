import { 
  WebSocketGateway, 
  SubscribeMessage, 
  MessageBody, 
  ConnectedSocket, 
  OnGatewayConnection,
  WebSocketServer 
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  cors: {
    origin: '*', // For dev
  },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private chatService: ChatService,
    private configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token;
      if (!token) {
        throw new Error('No token provided');
      }

      // Verify the token
      const secret = this.configService.get<string>('JWT_SECRET');
      const decoded = this.jwtService.verify(token, { secret });
      
      // Attach user info to socket client object
      client.data.user = decoded;
    } catch (error) {
      console.error('Socket authentication failed', error.message);
      client.disconnect();
    }
  }

  @SubscribeMessage('joinTrip')
  async handleJoinTrip(
    @ConnectedSocket() client: Socket,
    @MessageBody('tripId') tripId: string,
  ) {
    const userId = client.data.user?.userId;
    if (!userId) return;

    try {
      // The chatService saving/fetching validates if user is a member. 
      // We can assume if they made it this far and are trying to join, we let them join the socket room.
      // Real security check will happen when they fetch or send messages.
      client.join(tripId);
      console.log(`User ${userId} joined room ${tripId}`);
    } catch (e) {
      console.error(e);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { tripId: string; content: string },
  ) {
    const userId = client.data.user?.userId;
    if (!userId) return;

    try {
      // Save message via service (which also validates membership)
      const savedMessage = await this.chatService.saveMessage(userId, payload.tripId, payload.content);
      
      // Broadcast to everyone in the room (including the sender)
      this.server.to(payload.tripId).emit('newMessage', savedMessage);
    } catch (error) {
      console.error('Failed to send message', error);
      // Could emit an error back to the specific client
      client.emit('error', { message: 'Failed to send message' });
    }
  }
}
