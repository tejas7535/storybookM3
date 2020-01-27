import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import {
  SnackBarModule,
  SnackBarService
} from '@schaeffler/shared/ui-components';

import { ExtensionComponent } from './extension.component';

describe('ExtensionComponent', () => {
  let component: ExtensionComponent;
  let fixture: ComponentFixture<ExtensionComponent>;
  let router: Router;
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
      imports: [MatCardModule, RouterTestingModule, SnackBarModule],
      declarations: [ExtensionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtensionComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    component.extension = mockExtension;
    fixture.detectChanges();

    snackBarService = TestBed.get(SnackBarService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to extensiondetail page by extension name', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.gotoDetail('Test-Extensions');
    expect(navigateSpy).toHaveBeenCalledWith(['/extension', 'Test-Extensions']);
  });

  describe('showSuccessToast', () => {
    it('should call method ShowSuccessMessage of snackbarService', () => {
      snackBarService.showSuccessMessage = jest.fn();

      component.showSuccessToast();

      expect(snackBarService.showSuccessMessage).toHaveBeenCalled();
    });
  });
});
