import { Stub } from '../../../test/stub.class';
import * as SAP from '../../../utils/sap-localisation';
import { TrafficLightTooltipComponent } from './traffic-light-tooltip.component';

describe('TrafficLightTooltipComponent', () => {
  let component: TrafficLightTooltipComponent;

  beforeEach(() => {
    component = Stub.get<TrafficLightTooltipComponent>({
      component: TrafficLightTooltipComponent,
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    it('should set params property', () => {
      const params = { value: 'test' } as any;

      component.agInit(params);

      expect(component.params).toBe(params);
    });
  });

  describe('tooltipMessage', () => {
    let messageFromSAPSpy: jest.SpyInstance;

    beforeEach(() => {
      messageFromSAPSpy = jest
        .spyOn(SAP, 'messageFromSAP')
        .mockImplementation(
          (
            fallback,
            tlMessageNumber,
            tlMessageId,
            tlMessageV1,
            tlMessageV2,
            tlMessageV3,
            tlMessageV4
          ) => {
            if (
              fallback === 'fallback' &&
              tlMessageNumber === 123 &&
              tlMessageId === 'ID123' &&
              tlMessageV1 === 'V1' &&
              tlMessageV2 === 'V2' &&
              tlMessageV3 === 'V3' &&
              tlMessageV4 === 'V4'
            ) {
              return 'Valid Message';
            }

            return null;
          }
        );
    });

    it('should return message when messageFromSAP returns a valid message', () => {
      const mockParams = {
        value: 'fallback',
        node: {
          data: {
            tlMessageNumber: 123,
            tlMessageId: 'ID123',
            tlMessageV1: 'V1',
            tlMessageV2: 'V2',
            tlMessageV3: 'V3',
            tlMessageV4: 'V4',
          },
        },
      } as any;
      component.agInit(mockParams);
      messageFromSAPSpy.mockReturnValue('Valid Message');

      const result = component.tooltipMessage;

      expect(messageFromSAPSpy).toHaveBeenCalledWith(
        'fallback',
        123,
        'ID123',
        'V1',
        'V2',
        'V3',
        'V4'
      );
      expect(result).toBe('Valid Message');
    });

    it('should return null when messageFromSAP returns an empty string', () => {
      component.agInit({ value: 'fallback', node: { data: {} } } as any);
      messageFromSAPSpy.mockReturnValue('');

      const result = component.tooltipMessage;

      expect(result).toBeNull();
    });

    it('should return null when messageFromSAP returns null', () => {
      component.agInit({ value: 'fallback', node: { data: {} } } as any);
      messageFromSAPSpy.mockReturnValue(null);

      const result = component.tooltipMessage;

      expect(result).toBeNull();
    });

    it('should handle missing node data gracefully', () => {
      component.agInit({ value: 'fallback' } as any);
      messageFromSAPSpy.mockReturnValue('Message');

      const result = component.tooltipMessage;

      expect(messageFromSAPSpy).toHaveBeenCalledWith(
        'fallback',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      );
      expect(result).toBe('Message');
    });
  });
});
