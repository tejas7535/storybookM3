import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { TabsHeaderModule } from '../shared/tabs-header/tabs-header.module';
import { CompareComponent } from './compare.component';

describe('CompareComponent', () => {
  let component: CompareComponent;
  let spectator: Spectator<CompareComponent>;

  const createComponent = createComponentFactory({
    component: CompareComponent,
    imports: [
      provideTranslocoTestingModule({}),
      RouterTestingModule,
      TabsHeaderModule,
    ],
    declarations: [CompareComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('trackByFn', () => {
    test('should return index', () => {
      const result = component.trackByFn(3);

      expect(result).toEqual(3);
    });
  });
});
