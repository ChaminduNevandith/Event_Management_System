import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
