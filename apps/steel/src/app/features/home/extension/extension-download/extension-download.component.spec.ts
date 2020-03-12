import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {
  IconModule,
  SnackBarModule,
  SnackBarService
} from '@schaeffler/shared/ui-components';

import { ExtensionDownloadComponent } from './extension-download.component';

describe('ExtensionComponent', () => {
  let component: ExtensionDownloadComponent;
  let fixture: ComponentFixture<ExtensionDownloadComponent>;
  let snackBarService: SnackBarService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SnackBarModule, IconModule],
      declarations: [ExtensionDownloadComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtensionDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    snackBarService = TestBed.inject(SnackBarService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('showSuccessToast', () => {
    it('should call method ShowSuccessMessage of snackbarService', () => {
      snackBarService.showSuccessMessage = jest.fn();

      component.showSuccessToast();

      expect(snackBarService.showSuccessMessage).toHaveBeenCalled();
    });
  });
});
