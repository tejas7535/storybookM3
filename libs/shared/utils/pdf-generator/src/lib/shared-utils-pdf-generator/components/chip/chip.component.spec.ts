import { Colors } from '../../constants/colors.enum';
import {
  ChipComponent,
  defaultChipTextStyle,
  primaryChipStyle,
} from './chip.component';
import { ChipComponentData } from './chip.component.interface';

describe('ChipComponent', () => {
  let component: ChipComponent;

  const mockData: ChipComponentData = {
    chipText: 'Test Chip',
    chipStyle: {
      borderColor: Colors.Primary,
      fillColor: Colors.PrimaryContainer,
      textColor: Colors.OnPrimaryContainer,
    },
    chipTextStyle: {
      fontStyle: 'normal',
      fontSize: 8,
      fontFamily: 'Noto',
    },
    icon: 'base64pngIcon',
  };

  beforeEach(() => {
    component = new ChipComponent(mockData);
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with provided data', () => {
    expect(component['chipText']).toBe(mockData.chipText);
    expect(component['chipStyle']).toEqual(mockData.chipStyle);
    expect(component['chipTextStyle']).toEqual(mockData.chipTextStyle);
    expect(component['icon']).toBe(mockData.icon);
  });

  it('should use default styles if none are provided', () => {
    const defaultData: ChipComponentData = {
      chipText: 'Default Chip',
    };
    const defaultComponent = new ChipComponent(defaultData);

    expect(defaultComponent['chipStyle']).toEqual(primaryChipStyle);
    expect(defaultComponent['chipTextStyle']).toEqual(defaultChipTextStyle);
  });

  it('should render the chip correctly', () => {
    const mockDoc = {
      setDrawColor: jest.fn(),
      setFillColor: jest.fn(),
      setTextColor: jest.fn(),
      roundedRect: jest.fn(),
      getTextColor: jest.fn().mockReturnValue('#000000'),
      getFontSize: jest.fn().mockReturnValue(1.25),
      getLineHeight: jest.fn().mockReturnValue(1.25),
    };

    component['assertDoc'] = jest.fn().mockReturnValue(mockDoc);
    component['getTextDimensions'] = jest.fn().mockReturnValue({ h: 10 });
    component['getStringWidth'] = jest.fn().mockReturnValue(50);
    component['temporaryFontStyle'] = jest.fn().mockReturnValue(() => {});
    component['image'] = jest.fn();
    component['text'] = jest.fn();

    component.render();

    expect(mockDoc.setDrawColor).toHaveBeenCalledWith(Colors.Primary);
    expect(mockDoc.setFillColor).toHaveBeenCalledWith(Colors.PrimaryContainer);
    expect(mockDoc.setTextColor).toHaveBeenCalledWith(
      Colors.OnPrimaryContainer
    );
    expect(mockDoc.roundedRect).toHaveBeenCalled();
    expect(component['image']).toHaveBeenCalledWith(
      'base64pngIcon',
      expect.any(Number),
      expect.any(Number),
      4,
      4
    );
    expect(component['text']).toHaveBeenCalledWith(
      expect.any(Number),
      expect.any(Number),
      'Test Chip',
      { fontOptions: mockData.chipTextStyle }
    );
  });

  describe('when no icon is provided', () => {
    const mockDataWithoutIcon = {
      ...mockData,
      icon: undefined,
    };

    beforeEach(() => {
      component = new ChipComponent(mockDataWithoutIcon);
    });

    it('should create an instance', () => {
      expect(component).toBeTruthy();
    });

    it('should not have icon', () => {
      expect(component['icon']).toBe(undefined);
    });

    it('should render the chip correctly', () => {
      const mockDoc = {
        setDrawColor: jest.fn(),
        setFillColor: jest.fn(),
        setTextColor: jest.fn(),
        roundedRect: jest.fn(),
        getTextColor: jest.fn().mockReturnValue('#000000'),
        getFontSize: jest.fn().mockReturnValue(1.25),
        getLineHeight: jest.fn().mockReturnValue(1.25),
      };

      component['assertDoc'] = jest.fn().mockReturnValue(mockDoc);
      component['getTextDimensions'] = jest.fn().mockReturnValue({ h: 10 });
      component['getStringWidth'] = jest.fn().mockReturnValue(50);
      component['temporaryFontStyle'] = jest.fn().mockReturnValue(() => {});
      component['image'] = jest.fn();
      component['text'] = jest.fn();

      component.render();

      expect(mockDoc.setDrawColor).toHaveBeenCalledWith(Colors.Primary);
      expect(mockDoc.setFillColor).toHaveBeenCalledWith(
        Colors.PrimaryContainer
      );
      expect(mockDoc.setTextColor).toHaveBeenCalledWith(
        Colors.OnPrimaryContainer
      );
      expect(mockDoc.roundedRect).toHaveBeenCalled();
      expect(component['image']).not.toHaveBeenCalled();
      expect(component['text']).toHaveBeenCalledWith(
        expect.any(Number),
        expect.any(Number),
        'Test Chip',
        { fontOptions: mockData.chipTextStyle }
      );
    });
  });
});
