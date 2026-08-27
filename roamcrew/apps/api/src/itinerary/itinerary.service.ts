import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TripsService } from '../trips/trips.service';
import { CreateItineraryItemRequest, UpdateItineraryItemRequest, ItemType } from 'contracts';

@Injectable()
export class ItineraryService {
  constructor(
    private prisma: PrismaService,
    private tripsService: TripsService
  ) {}

  async create(userId: string, tripId: string, dto: CreateItineraryItemRequest) {
    await this.tripsService.findOne(userId, tripId); // verifies membership

    // Verify destination belongs to trip
    const dest = await this.prisma.client.destination.findFirst({
      where: { id: dto.destinationId, tripId }
    });
    if (!dest) throw new NotFoundException("Destination not found or doesn't belong to this trip");

    return this.prisma.client.itineraryItem.create({
      data: {
        destinationId: dto.destinationId,
        title: dto.title,
        description: dto.description,
        type: dto.type as ItemType,
        startTime: dto.startTime ? new Date(dto.startTime) : null,
        endTime: dto.endTime ? new Date(dto.endTime) : null,
        isAllDay: dto.isAllDay || false,
        placeId: dto.placeId || null,
        latitude: dto.latitude || null,
        longitude: dto.longitude || null,
      },
      include: {
        destination: true,
        place: true,
      }
    });
  }

  async findAll(userId: string, tripId: string) {
    await this.tripsService.findOne(userId, tripId);

    return this.prisma.client.itineraryItem.findMany({
      where: { 
        destination: { tripId } 
      },
      include: {
        destination: true,
        place: true,
      },
      orderBy: { startTime: 'asc' }
    });
  }

  async update(userId: string, tripId: string, id: string, dto: UpdateItineraryItemRequest) {
    await this.tripsService.findOne(userId, tripId);

    const item = await this.prisma.client.itineraryItem.findFirst({
      where: { id, destination: { tripId } }
    });
    if (!item) throw new NotFoundException("Itinerary item not found");

    const dataToUpdate: any = {};
    if (dto.title !== undefined) dataToUpdate.title = dto.title;
    if (dto.description !== undefined) dataToUpdate.description = dto.description;
    if (dto.type !== undefined) dataToUpdate.type = dto.type as ItemType;
    if (dto.startTime !== undefined) dataToUpdate.startTime = dto.startTime ? new Date(dto.startTime) : null;
    if (dto.endTime !== undefined) dataToUpdate.endTime = dto.endTime ? new Date(dto.endTime) : null;
    if (dto.isAllDay !== undefined) dataToUpdate.isAllDay = dto.isAllDay;
    if (dto.placeId !== undefined) dataToUpdate.placeId = dto.placeId;
    if (dto.latitude !== undefined) dataToUpdate.latitude = dto.latitude;
    if (dto.longitude !== undefined) dataToUpdate.longitude = dto.longitude;

    if (dto.destinationId) {
      const dest = await this.prisma.client.destination.findFirst({
        where: { id: dto.destinationId, tripId }
      });
      if (!dest) throw new NotFoundException("Destination not found or doesn't belong to this trip");
      dataToUpdate.destinationId = dto.destinationId;
    }

    return this.prisma.client.itineraryItem.update({
      where: { id },
      data: dataToUpdate,
      include: {
        destination: true,
        place: true,
      }
    });
  }

  async remove(userId: string, tripId: string, id: string) {
    await this.tripsService.findOne(userId, tripId);

    const item = await this.prisma.client.itineraryItem.findFirst({
      where: { id, destination: { tripId } }
    });

    if (!item) throw new NotFoundException("Itinerary item not found");

    await this.prisma.client.itineraryItem.delete({
      where: { id }
    });

    return { success: true };
  }

  async autoSchedule(userId: string, tripId: string) {
    const trip = await this.tripsService.findOne(userId, tripId);
    if (!trip.startDate || !trip.endDate) {
      throw new Error('Trip must have start and end dates to use auto-schedule.');
    }

    // Get all destinations for the trip with coordinates
    const destinations = await this.prisma.client.destination.findMany({
      where: { tripId, latitude: { not: null }, longitude: { not: null } }
    });

    if (destinations.length === 0) {
      throw new Error('No destinations with coordinates found to schedule.');
    }

    // Calculate days
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive

    // Calculate Haversine distance
    const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371; // Radius of the earth in km
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      return R * c; // Distance in km
    };
    
    // Sort destinations into clusters
    const clusters: typeof destinations[] = Array.from({ length: totalDays }, () => []);
    
    if (destinations.length <= totalDays) {
      // Just put each in a day
      destinations.forEach((d, i) => clusters[i].push(d));
    } else {
      // Simple greedy clustering
      const centroids = destinations.slice(0, totalDays);
      
      destinations.forEach(d => {
        let minDistance = Infinity;
        let closestClusterIdx = 0;
        
        centroids.forEach((c, idx) => {
          const dist = getDistance(d.latitude!, d.longitude!, c.latitude!, c.longitude!);
          if (dist < minDistance) {
            minDistance = dist;
            closestClusterIdx = idx;
          }
        });
        
        clusters[closestClusterIdx].push(d);
      });
    }

    // Map clusters to dates and create itinerary items
    const newItems = [];
    
    for (let i = 0; i < totalDays; i++) {
      const dayCluster = clusters[i];
      if (!dayCluster || dayCluster.length === 0) continue;
      
      const currentDate = new Date(start);
      currentDate.setDate(currentDate.getDate() + i);
      
      let hour = 10; // Start at 10 AM
      
      for (const dest of dayCluster) {
        const itemStartTime = new Date(currentDate);
        itemStartTime.setHours(hour, 0, 0, 0);
        
        const itemEndTime = new Date(currentDate);
        itemEndTime.setHours(hour + 2, 0, 0, 0); // 2 hours duration
        
        const item = await this.prisma.client.itineraryItem.create({
          data: {
            destinationId: dest.id,
            title: `Visit ${dest.name}`,
            type: 'ACTIVITY',
            startTime: itemStartTime,
            endTime: itemEndTime,
            latitude: dest.latitude,
            longitude: dest.longitude
          }
        });
        newItems.push(item);
        
        hour += 3; // 2 hours activity + 1 hour travel
        if (hour > 20) hour = 10; // Reset if it goes too late
      }
    }
    
    return newItems;
  }
}

