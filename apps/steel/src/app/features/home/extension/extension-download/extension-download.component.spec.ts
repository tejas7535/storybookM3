import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';

import { SnackBarModule, SnackBarService } from '@schaeffler/snackbar';

import { ExtensionDownloadComponent } from './extension-download.component';

describe('ExtensionComponent', () => {
  let component: ExtensionDownloadComponent;
  let fixture: ComponentFixture<ExtensionDownloadComponent>;
  let snackBarService: SnackBarService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SnackBarModule, MatIconModule],
      declarations: [ExtensionDownloadComponent],
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
