import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../../../../assets/i18n/en.json';
import { MsdDialogService } from '../../services';
import { MaturityInfoComponent } from './maturity-info.component';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string) => string),
}));

describe('MaturityInfoComponent', () => {
  let component: MaturityInfoComponent;
  let spectator: Spectator<MaturityInfoComponent>;

  const createComponent = createComponentFactory({
    component: MaturityInfoComponent,
    imports: [provideTranslocoTestingModule({ en })],
    providers: [
      {
        provide: MsdDialogService,
        useValue: {
          openInfoDialog: jest.fn(),
        },
      },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleClick', () => {
    test('should open the maturity info dialog', () => {
      component.handleClick();

      expect(component['dialogService'].openInfoDialog).toHaveBeenCalledWith(
        'materialsSupplierDatabase.mainTable.tooltip.maturity.moreInformationTitle',
        undefined,
        undefined,
        undefined,
        undefined,
        'materialsSupplierDatabase.mainTable.tooltip.maturity.moreInformationContact',
        'materialsSupplierDatabase.mainTable.tooltip.maturity.moreInformationContactLink',
        component.bottomTextTemplate
      );
    });
  });
});
