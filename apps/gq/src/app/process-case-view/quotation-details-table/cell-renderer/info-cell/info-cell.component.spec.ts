import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { QuotationInfoEnum } from '../../../../core/store/models';
import { InfoCellComponent } from './info-cell.component';

describe('InfoCellComponent', () => {
  let component: InfoCellComponent;
  let spectator: Spectator<InfoCellComponent>;

  const createComponent = createComponentFactory({
    component: InfoCellComponent,
    declarations: [InfoCellComponent],
    imports: [MatIconModule],
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
        value: QuotationInfoEnum.AddedToOffer,
      };
      component.agInit(params);

      expect(component.addToOffer).toBeTruthy();
    });
  });
});
