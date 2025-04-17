import {
  ChipComponent,
  Colors,
  Component,
  Rect,
} from '@schaeffler/pdf-generator';

import {
  SelectedProductComponent,
  SelectedProductComponetInterface,
} from './selected-product.component';

jest.mock('@schaeffler/pdf-generator', () => ({
  ...jest.requireActual('@schaeffler/pdf-generator'),
  ChipComponent: jest.fn().mockImplementation(() => ({
    setDocument: jest.fn(),
    setBounds: jest.fn(),
    render: jest.fn(),
  })),
}));

describe('SelectedProductComponent', () => {
  let component: SelectedProductComponent;
  const mockDoc = {
    getTextColor: jest.fn().mockReturnValue('#000000'),
    setTextColor: jest.fn(),
    setDrawColor: jest.fn(),
    setFillColor: jest.fn(),
    roundedRect: jest.fn(),
    getFont: jest.fn(),
    setFont: jest.fn(),
    getFontSize: jest.fn(),
    setFontSize: jest.fn(),
    getLineHeightFactor: jest.fn(),
    getTextDimensions: jest.fn().mockReturnValue({ h: 10, w: 15 }),
    getTextWidth: jest.fn(),
    getImageProperties: jest.fn(),
    addImage: jest.fn(),
    text: jest.fn(),
    image: jest.fn(),
    reset: jest.fn(),
  };

  const bounds = new Rect(0, 0, 200, 200);

  const mockData: SelectedProductComponetInterface = {
    selectionTitle: 'Test Selection Title',
    itemTitle: 'Test Item Title',
    itemDescription: 'Test Item Description',
    idLabel: 'ID Label',
    idValue: 'ID Value',
    chipLabel: 'Chip Label',
    productImage: 'testImageBase64',
  };

  beforeEach(() => {
    component = new SelectedProductComponent(mockData);
    component.setBounds(bounds);

    jest
      .spyOn(Component.prototype as any, 'getTextDimensions')
      .mockImplementation((_text, _style) => ({ h: 10, w: 15 }));

    jest
      .spyOn(component as any, 'getMultilineTextHeight')
      .mockImplementation(() => 5);

    component['_doc'] = mockDoc as any;
    mockDoc.getFont.mockReturnValue({ font: 'NotoSans' });
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with provided data', () => {
    expect(component['selectionTitle']).toBe(mockData.selectionTitle);
    expect(component['itemTitle']).toBe(mockData.itemTitle);
    expect(component['itemDescription']).toBe(mockData.itemDescription);
    expect(component['idLabel']).toBe(mockData.idLabel);
    expect(component['idValue']).toBe(mockData.idValue);
    expect(component['chipLabel']).toBe(mockData.chipLabel);
    expect(component['productImage']).toBe(mockData.productImage);
  });

  it('should evaluate the component correctly', () => {
    component['scaleImage'] = jest.fn(() => [10, 10]);
    const [fits, actualHeight, componentIfFits, componentIfNotFits] =
      component.evaluate(bounds);

    expect(fits).toBe(true);
    expect(actualHeight).toBeGreaterThan(0);
    expect(componentIfFits).toBe(component);
    expect(componentIfNotFits).toBeUndefined();
  });

  it('should render the component correctly', () => {
    component['image'] = jest.fn();
    component.render();

    expect(mockDoc.setTextColor).toHaveBeenCalledWith(Colors.TextHighEmphasis);
    expect(mockDoc.text).toHaveBeenCalledWith(
      mockData.selectionTitle,
      expect.any(Number),
      expect.any(Number),
      undefined
    );
    expect(component['image']).toHaveBeenCalledWith(
      mockData.productImage,
      expect.any(Number),
      expect.any(Number),
      50
    );
    expect(mockDoc.setTextColor).toHaveBeenCalledWith(
      Colors.TextMediumEmphasis
    );
    expect(mockDoc.setTextColor).toHaveBeenCalledWith(Colors.TextHighEmphasis);
  });

  it('should create and configure a ChipComponent correctly', () => {
    const mockSetDocument = jest.fn();
    const mockSetBounds = jest.fn();
    const mockRender = jest.fn();

    (ChipComponent as jest.Mock).mockImplementation(() => ({
      setDocument: mockSetDocument,
      setBounds: mockSetBounds,
      render: mockRender,
    }));

    const startX = 10;
    const startY = 20;

    component['renderChip'](startX, startY);

    expect(ChipComponent).toHaveBeenCalledWith({
      chipText: 'CHIP LABEL',
      icon: expect.any(String),
    });

    expect(mockSetDocument).toHaveBeenCalledWith(undefined);

    expect(mockSetBounds).toHaveBeenCalledWith(
      new Rect(startX, startY, 100, 50)
    );

    expect(mockRender).toHaveBeenCalled();
  });
});
