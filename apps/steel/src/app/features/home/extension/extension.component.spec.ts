import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';

import {
  IconModule,
  SnackBarModule,
  SnackBarService
} from '@schaeffler/shared/ui-components';

import { ExtensionComponent } from './extension.component';

describe('ExtensionComponent', () => {
  let component: ExtensionComponent;
  let fixture: ComponentFixture<ExtensionComponent>;
  let snackBarService: SnackBarService;

  const mockExtension = {
    name: 'Live Refresh',
    description:
      'Allows for continous live refresh in of live data connections in Tableau',
    WIP: false,
    path: 'liverefresh'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, RouterTestingModule, SnackBarModule, IconModule],
      declarations: [ExtensionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtensionComponent);
    component = fixture.componentInstance;
    component.extension = mockExtension;
    fixture.detectChanges();

    snackBarService = TestBed.get(SnackBarService);
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
