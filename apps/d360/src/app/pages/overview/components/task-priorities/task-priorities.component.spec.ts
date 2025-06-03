import { Priority } from '../../../../feature/alerts/model';
import { Stub } from './../../../../shared/test/stub.class';
import { TaskPrioritiesComponent } from './task-priorities.component';

describe('TaskPrioritiesComponent', () => {
  let component: TaskPrioritiesComponent;

  beforeEach(() => {
    component = Stub.get({
      component: TaskPrioritiesComponent,
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    it('should set params when initialized', () => {
      const mockParams = { value: 'test' } as any;

      component.agInit(mockParams);

      expect(component['params']).toBe(mockParams);
    });
  });

  describe('refresh', () => {
    it('should update params and return false', () => {
      const mockParams = { value: 'test' } as any;

      const result = component.refresh(mockParams);

      expect(component['params']).toBe(mockParams);
      expect(result).toBe(false);
    });
  });

  describe('Priority', () => {
    it('should expose Priority enum', () => {
      expect(component['Priority']).toBe(Priority);
    });
  });
});
