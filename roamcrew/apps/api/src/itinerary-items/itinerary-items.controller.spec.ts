import { Test, TestingModule } from '@nestjs/testing';
import { ItineraryItemsController } from './itinerary-items.controller';

describe('ItineraryItemsController', () => {
  let controller: ItineraryItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItineraryItemsController],
    }).compile();

    controller = module.get<ItineraryItemsController>(ItineraryItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
