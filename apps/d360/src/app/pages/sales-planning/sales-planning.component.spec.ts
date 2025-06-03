import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';

import { Stub } from '../../shared/test/stub.class';
import { SalesPlanningComponent } from './sales-planning.component';

describe('SalesPlanningComponent', () => {
  let component: SalesPlanningComponent;

  beforeEach(() => {
    component = Stub.getForEffect<SalesPlanningComponent>({
      component: SalesPlanningComponent,
      imports: [NgxEchartsModule],
      providers: [
        {
          provide: NGX_ECHARTS_CONFIG,
          useValue: { echarts: () => import('echarts') },
        },
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize customer with default values', () => {
    expect(component['customer']()).toEqual({
      customerNumber: null,
      customerName: null,
      planningCurrency: null,
    });
  });

  it('should initialize tableInFullscreen as null', () => {
    expect(component['tableInFullscreen']()).toBeNull();
  });

  describe('toggleTableFullscreen', () => {
    it('should toggle tableInFullscreen from null to true on first call', () => {
      component.toggleTableFullscreen();
      expect(component['tableInFullscreen']()).toBe(true);
    });

    it('should toggle tableInFullscreen from true to false', () => {
      // First set to true
      component['tableInFullscreen'].set(true);

      // Toggle
      component.toggleTableFullscreen();

      // Check result
      expect(component['tableInFullscreen']()).toBe(false);
    });

    it('should toggle tableInFullscreen from false to true', () => {
      // First set to false
      component['tableInFullscreen'].set(false);

      // Toggle
      component.toggleTableFullscreen();

      // Check result
      expect(component['tableInFullscreen']()).toBe(true);
    });
  });
});
