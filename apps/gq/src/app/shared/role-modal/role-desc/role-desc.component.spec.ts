import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { RoleDescComponent } from './role-desc.component';

describe('RoleDescComponent', () => {
  let component: RoleDescComponent;
  let spectator: Spectator<RoleDescComponent>;

  const createComponent = createComponentFactory({
    component: RoleDescComponent,
    declarations: [RoleDescComponent],
    imports: [provideTranslocoTestingModule({})],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('key setter', () => {
    test('should set key', () => {
      component.key = '1';

      expect(component.translationKey).toEqual('roleModal.1');
    });
  });
  describe('trackByFn', () => {
    test('should return index', () => {
      const result = component.trackByFn(3);

      expect(result).toEqual(3);
    });
  });
});
