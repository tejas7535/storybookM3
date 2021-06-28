import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { SharedPipesModule } from '../../pipes/shared-pipes.module';
import { CustomerHeaderModule } from '../customer-header/customer-header.module';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { CaseHeaderComponent } from './case-header.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('CaseHeaderComponent', () => {
  let component: CaseHeaderComponent;
  let spectator: Spectator<CaseHeaderComponent>;

  const createComponent = createComponentFactory({
    component: CaseHeaderComponent,
    detectChanges: false,
    imports: [
      CustomerHeaderModule,
      MatIconModule,
      MatMenuModule,
      provideTranslocoTestingModule({ en: {} }),
      RouterTestingModule,
      SharedPipesModule,
      ReactiveComponentModule,
    ],
    declarations: [BreadcrumbsComponent],
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('backClicked', () => {
    test('backClicked', () => {
      component['location'].back = jest.fn();

      component.backClicked();
      expect(component['location'].back).toHaveBeenCalledTimes(1);
    });
  });
});
