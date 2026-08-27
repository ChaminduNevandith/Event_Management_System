import { 
  WebSocketGateway, 
  SubscribeMessage, 
  MessageBody, 
  ConnectedSocket, 
  OnGatewayConnection,
  OnGatewayDisconnect,
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
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Track active users per trip room: tripId -> Map<socketId, userProfile>
  private activeUsers = new Map<string, Map<string, any>>();

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
      const secret = this.configService.get<string>('JWT_SECRET') || 'fallback_secret_do_not_use_in_prod';
      const decoded = this.jwtService.verify(token, { secret });
      
      // Attach user info to socket client object
      client.data.user = decoded;
    } catch (error) {
      console.error('Socket authentication failed', error.message);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    if (client.data.currentRoom) {
      const tripId = client.data.currentRoom;
      const roomUsers = this.activeUsers.get(tripId);
      if (roomUsers) {
        roomUsers.delete(client.id);
        this.server.to(tripId).emit('activeUsers', Array.from(roomUsers.values()));
        if (roomUsers.size === 0) {
          this.activeUsers.delete(tripId);
        }
      }
    }
  }

  @SubscribeMessage('joinTrip')
  async handleJoinTrip(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { tripId: string; user: any },
  ) {
    const userId = client.data.user?.sub;
    if (!userId || !payload.tripId) return;

    try {
      const tripId = payload.tripId;
      client.join(tripId);
      client.data.currentRoom = tripId;

      if (!this.activeUsers.has(tripId)) {
        this.activeUsers.set(tripId, new Map());
      }
      
      const roomUsers = this.activeUsers.get(tripId)!;
      // Add user profile, uniquely identified by socket ID to handle multiple tabs
      roomUsers.set(client.id, payload.user);
      
      // Broadcast updated active users list
      this.server.to(tripId).emit('activeUsers', Array.from(roomUsers.values()));
      
      console.log(`User ${userId} joined room ${tripId}`);
    } catch (e) {
      console.error(e);
    }
  }

  @SubscribeMessage('clientDataUpdated')
  async handleDataUpdated(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { tripId: string; eventType: string }
  ) {
    const userId = client.data.user?.sub;
    if (!userId || !payload.tripId) return;
    
    // Broadcast to everyone ELSE in the room that data updated
    client.to(payload.tripId).emit('dataUpdated', payload.eventType);
  }

  @SubscribeMessage('updateLocation')
  async handleUpdateLocation(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { tripId: string; lat: number; lng: number }
  ) {
    const userId = client.data.user?.sub;
    if (!userId || !payload.tripId) return;
    
    // Broadcast location to everyone else in the trip
    client.to(payload.tripId).emit('locationUpdated', {
      userId,
      lat: payload.lat,
      lng: payload.lng,
      timestamp: new Date().toISOString()
    });
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { tripId: string; content: string },
  ) {
    const userId = client.data.user?.sub;
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
