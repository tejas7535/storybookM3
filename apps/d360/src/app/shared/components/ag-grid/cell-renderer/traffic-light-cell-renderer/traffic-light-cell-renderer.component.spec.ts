import { Stub } from '../../../../test/stub.class';
import { TrafficLightCellRendererComponent } from './traffic-light-cell-renderer.component';

describe('TrafficLightCellRendererComponent', () => {
  let component: TrafficLightCellRendererComponent;

  beforeEach(() => {
    component = Stub.get<TrafficLightCellRendererComponent>({
      component: TrafficLightCellRendererComponent,
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with params when agInit is called', () => {
    const testParams = { value: 'test', data: { id: 1 } };
    component.agInit(testParams);

    expect(component['params']).toEqual(testParams);
  });

  it('should update params when refresh is called', () => {
    const initialParams = { value: 'initial', data: { id: 1 } };
    const updatedParams = { value: 'updated', data: { id: 2 } };

    component.agInit(initialParams);
    expect(component['params']).toEqual(initialParams);

    const result = component.refresh(updatedParams);
    expect(component['params']).toEqual(updatedParams);
    expect(result).toBe(true);
  });

  it('should handle null or undefined params', () => {
    component.agInit(null);
    expect(component['params']).toBeNull();

    component.agInit(undefined as any);
    expect(component['params']).toBeUndefined();

    const result = component.refresh({ value: 'new' });
    expect(component['params']).toEqual({ value: 'new' });
    expect(result).toBe(true);
  });

  it('should handle params with complex objects', () => {
    const complexParams = {
      value: 'test',
      data: {
        id: 1,
        nested: { prop: 'value' },
      },
      column: { colId: 'col1' },
      api: { someMethod: jest.fn() },
    };

    component.agInit(complexParams);
    expect(component['params']).toEqual(complexParams);
  });
});
