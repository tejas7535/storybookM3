import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { of } from 'rxjs';

import { FPricingFacade } from '@gq/core/store/f-pricing/f-pricing.facade';
import { MaterialSalesOrg } from '@gq/shared/models/quotation-detail/material-sales-org.model';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MaterialDetailsComponent } from './material-details.component';

describe('MaterialDetailsComponent', () => {
  let component: MaterialDetailsComponent;
  let spectator: Spectator<MaterialDetailsComponent>;

  const createComponent = createComponentFactory({
    component: MaterialDetailsComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      {
        provide: FPricingFacade,
        useValue: {
          materialSalesOrg$: of({ materialStatus: 'f' } as MaterialSalesOrg),
          materialSalesOrgDataAvailable$: of(true),
        },
      },
      { provide: MatDialogRef, useValue: {} },
      {
        provide: MAT_DIALOG_DATA,
        useValue: { quotationDetail: {} },
      },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  test(
    'Observables',
    marbles((m) => {
      m.expect(component.materialSalesOrg$).toBeObservable('(a|)', {
        a: { materialStatus: 'f' } as MaterialSalesOrg,
      });
      m.expect(component.materialSalesOrgDataAvailable$).toBeObservable(
        '(a|)',
        {
          a: true,
        }
      );
    })
  );

  describe('closeDialog', () => {
    it('should close the dialog', () => {
      component['dialogRef'].close = jest.fn();
      component.closeDialog();
      expect(component['dialogRef'].close).toHaveBeenCalled();
    });
  });
});
