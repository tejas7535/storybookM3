import { AccessoryTable } from './accessory-table.model';
import { SortedAccessoryListPipe } from './sorted-accessory-list.pipe';

describe('SortedAccessoryListPipe', () => {
  let pipe: SortedAccessoryListPipe;

  const createPipe = () => new SortedAccessoryListPipe();

  beforeAll(() => {
    pipe = createPipe();
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should high priority items up front', () => {
    const TEST_PAYLOAD: AccessoryTable = {
      TEST1: {
        groupTitle: 'Test 1',
        groupClassId: '1',
        groupClassPriority: 0,
        items: [],
      },
      TEST2: {
        groupTitle: 'Test 1',
        groupClassId: '22',
        groupClassPriority: 999,
        items: [],
      },
    };

    const result = pipe.transform(TEST_PAYLOAD);
    expect(result[0].key).toEqual('TEST2');
    expect(result[1].key).toEqual('TEST1');
  });

  it('should not do any sorting when no priorities are set', () => {
    const TEST_PAYLOAD: AccessoryTable = {
      TEST1: {
        groupTitle: 'Test 1',
        groupClassId: '1',
        items: [],
      },
      TEST2: {
        groupTitle: 'Test 1',
        groupClassId: '22',
        items: [],
      },
    };

    const result = pipe.transform(TEST_PAYLOAD);
    expect(result[0].key).toEqual('TEST1');
    expect(result[1].key).toEqual('TEST2');
  });
});
