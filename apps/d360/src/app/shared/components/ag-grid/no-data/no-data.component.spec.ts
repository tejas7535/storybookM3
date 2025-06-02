import { Stub } from '../../../test/stub.class';
import { NoDataOverlayComponent } from './no-data.component';

describe('NoDataOverlayComponent', () => {
  let component: NoDataOverlayComponent;

  beforeEach(() => {
    component = Stub.get<NoDataOverlayComponent>({
      component: NoDataOverlayComponent,
    });
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    it('should set text property to provided message', () => {
      const params = { message: 'Custom message' } as any;
      component.agInit(params);
      expect(component['text']).toBe('Custom message');
    });

    it('should use translation when no message is provided', () => {
      const params = {} as any;
      component.agInit(params);
      expect(component['text']).toBe('hint.noData');
    });

    it('should use translation when message is empty string', () => {
      const params = { message: '' } as any;
      component.agInit(params);
      expect(component['text']).toBe('hint.noData');
    });

    it('should handle additional params properly', () => {
      const params = {
        message: 'Custom message',
        api: {},
        columnApi: {},
      } as any;
      component.agInit(params);
      expect(component['text']).toBe('Custom message');
    });
  });
});
