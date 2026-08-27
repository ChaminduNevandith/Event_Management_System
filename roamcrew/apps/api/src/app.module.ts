import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TripsModule } from './trips/trips.module';
import { DestinationsModule } from './destinations/destinations.module';
import { ConfigModule } from '@nestjs/config';
import { ExpensesModule } from './expenses/expenses.module';
import { ChatModule } from './chat/chat.module';
import { FriendsModule } from './friends/friends.module';
import { CirclesModule } from './circles/circles.module';
import { InvitationsModule } from './invitations/invitations.module';
import { PlacesModule } from './places/places.module';
import { PollsModule } from './polls/polls.module';
import { ItineraryModule } from './itinerary/itinerary.module';

import { AccommodationsModule } from './accommodations/accommodations.module';
import { TransportModule } from './transport/transport.module';
import { TasksModule } from './tasks/tasks.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ActivityLogsModule } from './activity-logs/activity-logs.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    TripsModule,
    DestinationsModule,
    ExpensesModule,
    ChatModule,
    FriendsModule,
    CirclesModule,
    InvitationsModule,
    PlacesModule,
    PollsModule,
    ItineraryModule,
    AccommodationsModule,
    TransportModule,
    TasksModule,
    NotificationsModule,
    ActivityLogsModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
