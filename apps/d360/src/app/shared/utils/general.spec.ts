import { keyHandler } from './general';

describe('keyHandler', () => {
  let mockCallback: jest.Mock;
  let mockEvent: KeyboardEvent;

  beforeEach(() => {
    // Create a mock callback function
    mockCallback = jest.fn();

    // Create a mock KeyboardEvent
    mockEvent = {
      key: 'Enter',
      stopPropagation: jest.fn(),
      preventDefault: jest.fn(),
    } as unknown as KeyboardEvent;
  });

  it('should call stopPropagation and preventDefault on the event', () => {
    const handler = keyHandler(mockEvent);
    handler(mockCallback);

    expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
  });

  it('should call the callback when Enter key is pressed (default allowed keys)', () => {
    const handler = keyHandler(mockEvent);
    handler(mockCallback, 'arg1', 'arg2');

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('should call the callback when Space key is pressed (default allowed keys)', () => {
    (mockEvent as any).key = ' ';
    const handler = keyHandler(mockEvent);
    handler(mockCallback);

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should not call the callback when a non-allowed key is pressed', () => {
    (mockEvent as any).key = 'Tab';
    const handler = keyHandler(mockEvent);
    handler(mockCallback);

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should call the callback when a key from custom allowed keys is pressed', () => {
    (mockEvent as any).key = 'Escape';
    const handler = keyHandler(mockEvent, ['Escape', 'Tab']);
    handler(mockCallback);

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should not call the callback when a key not in custom allowed keys is pressed', () => {
    (mockEvent as any).key = 'Enter'; // Enter is not in the custom allowed keys
    const handler = keyHandler(mockEvent, ['Escape', 'Tab']);
    handler(mockCallback);

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should pass multiple arguments to the callback', () => {
    const handler = keyHandler(mockEvent);
    const arg1 = { test: 'object' };
    const arg2 = 42;
    const arg3 = 'string';

    handler(mockCallback, arg1, arg2, arg3);

    expect(mockCallback).toHaveBeenCalledWith(arg1, arg2, arg3);
  });
});
