import { Test, TestingModule } from '@nestjs/testing';
import { ItineraryItemsService } from './itinerary-items.service';

describe('ItineraryItemsService', () => {
  let service: ItineraryItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItineraryItemsService],
    }).compile();

    service = module.get<ItineraryItemsService>(ItineraryItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
