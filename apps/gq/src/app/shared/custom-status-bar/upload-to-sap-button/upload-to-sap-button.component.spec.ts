import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { UploadToSapButtonComponent } from './upload-to-sap-button.component';

describe('UploadToSapButtonComponent', () => {
  let component: UploadToSapButtonComponent;

  let spectator: Spectator<UploadToSapButtonComponent>;

  const createComponent = createComponentFactory({
    component: UploadToSapButtonComponent,
    declarations: [UploadToSapButtonComponent],
    imports: [
      MatButtonModule,
      provideTranslocoTestingModule({}),
      MatIconModule,
    ],
    providers: [provideMockStore({})],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('uploadToSAP', () => {
    test('should upload to SAP', () => {
      jest.spyOn(window, 'alert').mockImplementation(() => {});

      component.uploadToSAP();
      // ToDo: Add open window
    });
  });
});
