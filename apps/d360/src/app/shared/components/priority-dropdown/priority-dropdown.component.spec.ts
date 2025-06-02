import { Priority } from '../../../feature/alerts/model';
import { Stub } from '../../test/stub.class';
import { PriorityDropdownComponent } from './priority-dropdown.component';

describe('PriorityDropdownComponent', () => {
  let component: PriorityDropdownComponent;

  beforeEach(() => {
    component = Stub.get<PriorityDropdownComponent>({
      component: PriorityDropdownComponent,
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the priorities for the SelectableValues', (done) => {
    component.selectionChange.subscribe((value) => {
      expect(value).toEqual([Priority.Priority1, Priority.Priority2]);
      done();
    });
    component['onPrioritySelectionChange']([
      {
        id: '1',
        text: 'overview.yourTasks.priority1',
      },
      {
        id: '2',
        text: 'overview.yourTasks.priority2',
      },
    ]);
  });

  it('should have a form group with priority control', () => {
    expect(component['yourTasksForm']).toBeDefined();
    expect(component['yourTasksForm'].get('priority')).toBe(
      component['priorityControl']
    );
  });

  it('should initialize priority control with the priorities array', () => {
    expect(component['priorityControl'].value).toEqual(component['priorities']);
  });

  it('should have priorities array with three items', () => {
    expect(component['priorities'].length).toBe(3);
  });

  it('should have correctly defined priorities with IDs and translated texts', () => {
    expect(component['priorities']).toContainEqual({
      id: Priority.Priority1.toString(),
      text: expect.any(String),
    });
    expect(component['priorities']).toContainEqual({
      id: Priority.Priority2.toString(),
      text: expect.any(String),
    });
    expect(component['priorities']).toContainEqual({
      id: Priority.Priority3.toString(),
      text: expect.any(String),
    });
  });

  it('should handle null or undefined values in onPrioritySelectionChange', () => {
    const emitSpy = jest.spyOn(component.selectionChange, 'emit');

    component['onPrioritySelectionChange'](null);
    expect(emitSpy).toHaveBeenCalledWith(undefined);

    component['onPrioritySelectionChange'](undefined as any);
    expect(emitSpy).toHaveBeenCalledWith(undefined);
  });
});
