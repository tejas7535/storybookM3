import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { ListItemsWrapperService } from './list-items-wrapper.service';

describe('ListItemsWrapperService', () => {
  let spectator: SpectatorService<ListItemsWrapperService>;
  const createService = createServiceFactory(ListItemsWrapperService);

  beforeEach(() => {
    spectator = createService();
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should return the same array if items length is less than minimumNumberOfItemsToBeWrapped', () => {
    const items = [
      'This is my list:',
      '  · Arcanol XTRA3',
      '  · Arcanol Clean M',
    ];
    const minimumNumberOfItemsToBeWrapped = 4;
    const result = spectator.service.wrapListItems(
      items,
      minimumNumberOfItemsToBeWrapped
    );
    expect(result).toEqual(items);
  });

  it('should wrap list items into a comma-separated string if their count exceeds the threshold', () => {
    const items = [
      'This is my list:',
      '  · Arcanol XTRA3',
      '  · Arcanol Clean M',
      '  · Arcanol MOTION 2',
      '  · Non-Schaeffler Multi-Purpose Grease',
      'Another normal string after.',
      '  · Arcanol TEMP120',
      '  · Arcanol TEMP200',
      '  · Arcanol SPEED 2,6',
      'End of the list.',
    ];
    const minimumNumberOfItemsToBeWrapped = 3;
    const expected = [
      'This is my list:',
      'Arcanol XTRA3, Arcanol Clean M, Arcanol MOTION 2, Non-Schaeffler Multi-Purpose Grease',
      'Another normal string after.',
      'Arcanol TEMP120, Arcanol TEMP200, Arcanol SPEED 2,6',
      'End of the list.',
    ];
    const result = spectator.service.wrapListItems(
      items,
      minimumNumberOfItemsToBeWrapped
    );
    expect(result).toEqual(expected);
  });

  it('should handle mixed content correctly', () => {
    const items = [
      'Introduction:',
      '  · Item 1',
      '  · Item 2',
      '  · Item 3',
      'Conclusion:',
      '  · Item 4',
      '  · Item 5',
      'End.',
    ];
    const minimumNumberOfItemsToBeWrapped = 3;
    const expected = [
      'Introduction:',
      'Item 1, Item 2, Item 3',
      'Conclusion:',
      '  · Item 4',
      '  · Item 5',
      'End.',
    ];
    const result = spectator.service.wrapListItems(
      items,
      minimumNumberOfItemsToBeWrapped
    );
    expect(result).toEqual(expected);
  });

  it('should handle no list items correctly', () => {
    const items = [
      'This is my list:',
      'Another normal string after.',
      'End of the list.',
    ];
    const minimumNumberOfItemsToBeWrapped = 3;
    const result = spectator.service.wrapListItems(
      items,
      minimumNumberOfItemsToBeWrapped
    );
    expect(result).toEqual(items);
  });

  it('should handle remaining list items at the end of the array', () => {
    const items = [
      'This is my list:',
      '  · Arcanol XTRA3',
      '  · Arcanol Clean M',
      '  · Arcanol MOTION 2',
      '  · Non-Schaeffler Multi-Purpose Grease',
    ];
    const minimumNumberOfItemsToBeWrapped = 3;
    const expected = [
      'This is my list:',
      'Arcanol XTRA3, Arcanol Clean M, Arcanol MOTION 2, Non-Schaeffler Multi-Purpose Grease',
    ];
    const result = spectator.service.wrapListItems(
      items,
      minimumNumberOfItemsToBeWrapped
    );
    expect(result).toEqual(expected);
  });

  it('should handle list items less than the threshold at the end of the array', () => {
    const items = [
      'This is my list:',
      '  · Arcanol XTRA3',
      '  · Arcanol Clean M',
      'Another normal string after.',
      '  · Arcanol TEMP120',
      '  · Arcanol TEMP200',
    ];
    const minimumNumberOfItemsToBeWrapped = 3;
    const expected = [
      'This is my list:',
      '  · Arcanol XTRA3',
      '  · Arcanol Clean M',
      'Another normal string after.',
      '  · Arcanol TEMP120',
      '  · Arcanol TEMP200',
    ];
    const result = spectator.service.wrapListItems(
      items,
      minimumNumberOfItemsToBeWrapped
    );
    expect(result).toEqual(expected);
  });
});
