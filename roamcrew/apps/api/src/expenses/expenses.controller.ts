import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { CreateExpenseSchema } from 'contracts';

@Controller('trips/:tripId/expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  findAll(
    @Request() req: any,
    @Param('tripId') tripId: string,
  ) {
    return this.expensesService.findAllForTrip(req.user.userId, tripId);
  }

  @Post()
  create(
    @Request() req: any,
    @Param('tripId') tripId: string,
    @Body(new ZodValidationPipe(CreateExpenseSchema)) createDto: any,
  ) {
    return this.expensesService.create(req.user.userId, tripId, createDto);
  }

  @Delete(':expenseId')
  remove(
    @Request() req: any,
    @Param('tripId') tripId: string,
    @Param('expenseId') expenseId: string,
  ) {
    return this.expensesService.remove(req.user.userId, tripId, expenseId);
  }
}
