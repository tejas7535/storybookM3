import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { uploadOfferToSap } from '../../../core/store';
import { UploadToSapButtonComponent } from './upload-to-sap-button.component';

describe('UploadToSapButtonComponent', () => {
  let component: UploadToSapButtonComponent;
  let spectator: Spectator<UploadToSapButtonComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: UploadToSapButtonComponent,
    declarations: [UploadToSapButtonComponent],
    imports: [
      MatButtonModule,
      MatIconModule,
      ReactiveComponentModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('uploadToSAP', () => {
    test('should upload to SAP', () => {
      store.dispatch = jest.fn();

      component.uploadToSAP();

      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenLastCalledWith(uploadOfferToSap());
    });
  });
});
