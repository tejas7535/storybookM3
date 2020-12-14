import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CustomerDetailsModule } from '../customer-details/customer-details.module';
import { GqQuotationPipe } from '../pipes/gq-quotation.pipe';
import { MaterialInfoPipe } from '../pipes/material-info.pipe';
import { SapQuotationPipe } from '../pipes/sap-quotation.pipe';
import { CaseHeaderComponent } from './case-header.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('ProcessCaseHeaderComponent', () => {
  let component: CaseHeaderComponent;
  let spectator: Spectator<CaseHeaderComponent>;

  const createComponent = createComponentFactory({
    component: CaseHeaderComponent,
    detectChanges: false,
    imports: [
      CustomerDetailsModule,
      MatIconModule,
      provideTranslocoTestingModule({}),
      RouterTestingModule,
    ],
    providers: [provideMockStore({})],
    declarations: [
      CaseHeaderComponent,
      SapQuotationPipe,
      MaterialInfoPipe,
      GqQuotationPipe,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('drawerToggle', () => {
    test('toggle drawer', () => {
      component['toggleOfferDrawer'].emit = jest.fn();

      component.drawerToggle();
      expect(component['toggleOfferDrawer'].emit).toHaveBeenCalledTimes(1);
    });
  });
  describe('backClicked', () => {
    test('backClicked', () => {
      component['location'].back = jest.fn();

      component.backClicked();
      expect(component['location'].back).toHaveBeenCalledTimes(1);
    });
  });
});
