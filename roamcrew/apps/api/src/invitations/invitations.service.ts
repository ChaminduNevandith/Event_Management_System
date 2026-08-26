import { Injectable, NotFoundException, ForbiddenException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvitationsService {
  constructor(private prisma: PrismaService) {}

  async createInvitation(userId: string, tripId: string, data: { inviteeUsername?: string; role?: 'ADMIN' | 'MEMBER' | 'VIEWER'; maxUses?: number; expiresAt?: Date }) {
    // Check if user is admin or owner of the trip
    const member = await this.prisma.client.tripMember.findUnique({
      where: { userId_tripId: { userId, tripId } }
    });
    if (!member || (member.role !== 'OWNER' && member.role !== 'ADMIN')) {
      throw new ForbiddenException('Only trip admins can send invitations');
    }

    let inviteeId = null;
    if (data.inviteeUsername) {
      const invitee = await this.prisma.client.user.findUnique({ where: { username: data.inviteeUsername } });
      if (!invitee) throw new NotFoundException('User not found');
      inviteeId = invitee.id;

      // Check if already in trip
      const existingMember = await this.prisma.client.tripMember.findUnique({
        where: { userId_tripId: { userId: invitee.id, tripId } }
      });
      if (existingMember) throw new ConflictException('User is already in this trip');
      
      // Check if already invited
      const existingInvite = await this.prisma.client.tripInvitation.findFirst({
        where: { tripId, inviteeId, status: 'PENDING' }
      });
      if (existingInvite) throw new ConflictException('User already has a pending invitation to this trip');
    }

    return this.prisma.client.tripInvitation.create({
      data: {
        tripId,
        inviterId: userId,
        inviteeId,
        role: data.role || 'MEMBER',
        maxUses: data.maxUses,
        expiresAt: data.expiresAt
      }
    });
  }

  async getPendingInvitations(userId: string) {
    return this.prisma.client.tripInvitation.findMany({
      where: { inviteeId: userId, status: 'PENDING' },
      include: {
        trip: true,
        inviter: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, username: true } }
      }
    });
  }

  async previewInvitation(token: string) {
    const invite = await this.prisma.client.tripInvitation.findUnique({
      where: { token },
      include: {
        trip: { select: { id: true, title: true, coverImageUrl: true, startDate: true, endDate: true } },
        inviter: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, username: true } }
      }
    });

    if (!invite) throw new NotFoundException('Invalid invitation link');
    
    if (invite.status !== 'PENDING') {
      throw new BadRequestException(`This invitation is ${invite.status.toLowerCase()}`);
    }

    if (invite.expiresAt && invite.expiresAt < new Date()) {
      throw new BadRequestException('This invitation has expired');
    }

    if (invite.maxUses && invite.uses >= invite.maxUses) {
      throw new BadRequestException('This invitation has reached its usage limit');
    }

    return invite;
  }

  async acceptInvitation(userId: string, token: string) {
    const invite = await this.previewInvitation(token); // Re-uses the validation logic above

    // If it's a direct invite, ensure the user matches
    if (invite.inviteeId && invite.inviteeId !== userId) {
      throw new ForbiddenException('This invitation was sent to someone else');
    }

    // Check if user is already a member
    const existingMember = await this.prisma.client.tripMember.findUnique({
      where: { userId_tripId: { userId, tripId: invite.tripId } }
    });

    if (existingMember) {
      throw new ConflictException('You are already a member of this trip');
    }

    // Accept invite in a transaction
    return this.prisma.client.$transaction(async (tx: any) => {
      // Create trip member
      await tx.tripMember.create({
        data: {
          userId,
          tripId: invite.tripId,
          role: invite.role
        }
      });

      // Update invite
      const newUses = invite.uses + 1;
      const shouldClose = (invite.maxUses && newUses >= invite.maxUses) || invite.inviteeId; // Direct invites close after 1 use
      
      return tx.tripInvitation.update({
        where: { id: invite.id },
        data: {
          uses: newUses,
          status: shouldClose ? 'ACCEPTED' : 'PENDING'
        }
      });
    });
  }

  async revokeInvitation(userId: string, inviteId: string) {
    const invite = await this.prisma.client.tripInvitation.findUnique({ where: { id: inviteId } });
    if (!invite) throw new NotFoundException('Invitation not found');

    const member = await this.prisma.client.tripMember.findUnique({
      where: { userId_tripId: { userId, tripId: invite.tripId } }
    });

    if (!member || (member.role !== 'OWNER' && member.role !== 'ADMIN' && invite.inviterId !== userId)) {
      throw new ForbiddenException('Not authorized to revoke this invitation');
    }

    return this.prisma.client.tripInvitation.update({
      where: { id: inviteId },
      data: { status: 'REVOKED' }
    });
  }
}
