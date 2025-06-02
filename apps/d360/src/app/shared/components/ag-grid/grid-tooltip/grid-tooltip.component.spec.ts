import { Stub } from '../../../test/stub.class';
import { GridTooltipComponent } from './grid-tooltip.component';

describe('GridTooltipComponent', () => {
  let component: GridTooltipComponent;

  beforeEach(() => {
    component = Stub.get<GridTooltipComponent>({
      component: GridTooltipComponent,
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    it('sets correct data', () => {
      component.agInit({
        wide: true,
        lineBreaks: true,
        textLeft: true,
        location: 'UNKNOWN',
        value: '123',
      } as any);

      expect(component.params).toEqual({
        wide: true,
        lineBreaks: true,
        textLeft: true,
        location: 'UNKNOWN',
        value: '123',
      });
    });
  });
});
