import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { IStatusPanelParams } from '@ag-grid-community/all-modules';
import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { VIEW_QUOTATION_MOCK } from '../../../../testing/mocks';
import { OpenCaseButtonComponent } from './open-case-button.component';

describe('OpenCaseButtonComponent', () => {
  let component: OpenCaseButtonComponent;
  let spectator: Spectator<OpenCaseButtonComponent>;
  let params: IStatusPanelParams;
  let router: Router;

  const createComponent = createComponentFactory({
    component: OpenCaseButtonComponent,
    imports: [
      MatButtonModule,
      MatIconModule,
      provideTranslocoTestingModule({}),
      RouterTestingModule.withRoutes([]),
    ],
    declarations: [OpenCaseButtonComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    params = ({
      api: {
        addEventListener: jest.fn(),
        getSelectedRows: jest.fn(),
      },
    } as unknown) as IStatusPanelParams;
    router = spectator.inject(Router);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('agInit', () => {
    test('should set params and add listeners', () => {
      component.agInit((params as unknown) as IStatusPanelParams);

      expect(component['params']).toEqual(params);

      expect(params.api.addEventListener).toHaveBeenCalledTimes(1);
    });
  });

  describe('onSelectionChange', () => {
    test('should set selections', () => {
      component['params'] = params;
      component.onSelectionChange();

      expect(params.api.getSelectedRows).toHaveBeenCalled();
    });
  });

  describe('openCase', () => {
    test('should open Case', () => {
      router.navigate = jest.fn();
      component.selections = [VIEW_QUOTATION_MOCK];
      component.openCase();
      expect(router.navigate).toHaveBeenCalled();
    });
  });
});
