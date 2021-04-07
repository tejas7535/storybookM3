import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { IStatusPanelParams } from '@ag-grid-community/all-modules';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { DetailViewButtonComponent } from './detail-view-button.component';

describe('DetailViewButtonComponent', () => {
  let component: DetailViewButtonComponent;
  let spectator: Spectator<DetailViewButtonComponent>;
  let params: IStatusPanelParams;
  let router: Router;

  const createComponent = createComponentFactory({
    component: DetailViewButtonComponent,
    declarations: [DetailViewButtonComponent],
    imports: [
      MatButtonModule,
      RouterTestingModule.withRoutes([]),
      provideTranslocoTestingModule({}),
      MatIconModule,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    router = spectator.inject(Router);
    params = ({
      api: {
        addEventListener: jest.fn(),
        getSelectedRows: jest.fn(),
      },
    } as unknown) as IStatusPanelParams;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set params and add listeners', () => {
      component.agInit((params as unknown) as IStatusPanelParams);

      expect(component['params']).toEqual(params);

      expect(params.api.addEventListener).toHaveBeenCalledTimes(2);
    });
  });

  describe('onGridReady', () => {
    test('should set selections', () => {
      component['params'] = params;
      component.onGridReady();

      expect(params.api.getSelectedRows).toHaveBeenCalled();
    });
  });

  describe('onSelectionChange', () => {
    test('should set selections', () => {
      component['params'] = params;
      component.onSelectionChange();

      expect(params.api.getSelectedRows).toHaveBeenCalled();
    });
  });

  describe('showDetailView', () => {
    test('should navigate', () => {
      component.selections = [{ materialNumber: '', gqPositionId: '' }] as any;
      spyOn(router, 'navigate');
      component.showDetailView();
      expect(router.navigate).toHaveBeenCalled();
    });
  });
});
