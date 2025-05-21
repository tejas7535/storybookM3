import { Colors, Rect } from '@schaeffler/pdf-generator';

import { CardConfigOptions, CardContent, SPACING } from './card-content';

describe('CardContent', () => {
  it('should create with default options', () => {
    const cardContent = new CardContent();
    expect(cardContent).toBeTruthy();

    // @ts-expect-error - accessing protected property for testing
    expect(cardContent.backgroundColor).toBe(Colors.Surface);
    // @ts-expect-error - accessing protected property for testing
    expect(cardContent.padding).toBe(SPACING.STANDARD);
    // @ts-expect-error - accessing protected property for testing
    expect(cardContent.margin).toBe(SPACING.NONE);
  });

  it('should create with custom options', () => {
    const options: CardConfigOptions = {
      backgroundColor: '#FF0000',
      padding: 10,
      margin: 5,
    };

    const cardContent = new CardContent(options);

    // @ts-expect-error - accessing protected property for testing
    expect(cardContent.backgroundColor).toBe('#FF0000');
    // @ts-expect-error - accessing protected property for testing
    expect(cardContent.padding).toBe(10);
    // @ts-expect-error - accessing protected property for testing
    expect(cardContent.margin).toBe(5);
  });

  it('should handle partial options', () => {
    const cardContent = new CardContent({ backgroundColor: '#00FF00' });

    // @ts-expect-error - accessing protected property for testing
    expect(cardContent.backgroundColor).toBe('#00FF00');
    // Default values for unspecified options
    // @ts-expect-error - accessing protected property for testing
    expect(cardContent.padding).toBe(SPACING.STANDARD);
    // @ts-expect-error - accessing protected property for testing
    expect(cardContent.margin).toBe(SPACING.NONE);
  });

  it('should correctly evaluate bounds', () => {
    const cardContent = new CardContent();
    const bounds = new Rect(0, 0, 100, 200);

    const [success, height] = cardContent.evaluate(bounds);

    expect(success).toBe(true);
    expect(height).toBe(0); // Base class returns 0 height
  });

  it('should render correctly with bounds set', () => {
    const cardContent = new CardContent();

    // Mock the renderBackground method to avoid the need for a real PDF document
    // @ts-expect-error - overriding protected method for testing
    cardContent.renderBackground = jest.fn();

    // Set bounds to avoid the "Called render before setting rendering bounds" error
    cardContent.setBounds(new Rect(0, 0, 100, 100));

    // Rendering shouldn't throw an error now
    cardContent.render();

    // Verify that renderBackground was called
    // @ts-expect-error - accessing mocked method for testing
    expect(cardContent.renderBackground).toHaveBeenCalled();
  });
});
