import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { dummyRowData } from '../../../core/store/reducers/create-case/config/dummy-row-data';
import { InfoCellComponent } from './info-cell.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('InfoCellComponent', () => {
  let component: InfoCellComponent;
  let spectator: Spectator<InfoCellComponent>;

  const createComponent = createComponentFactory({
    component: InfoCellComponent,
    declarations: [InfoCellComponent],
    imports: [MatIconModule, MatTooltipModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set params', () => {
      const params: any = {
        value: { valid: true },
        data: dummyRowData,
      };
      component.agInit(params);

      expect(component.valid).toBeTruthy();
      expect(component.isDummy).toBeTruthy();
    });
  });
});
