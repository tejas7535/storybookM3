import { IStatusPanelParams } from '@ag-grid-community/all-modules';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { configureTestSuite } from 'ng-bullet';

import { AddToOfferButtonComponent } from './add-to-offer-button.component';

describe('AddToOfferButtonComponent', () => {
  let component: AddToOfferButtonComponent;
  let fixture: ComponentFixture<AddToOfferButtonComponent>;
  let params: IStatusPanelParams;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [AddToOfferButtonComponent],
      imports: [
        MatButtonModule,
        MatIconModule,
        provideTranslocoTestingModule({}),
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToOfferButtonComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
    params = ({
      api: {
        addEventListener: jest.fn(),
        getSelectedRows: jest.fn(),
      },
    } as unknown) as IStatusPanelParams;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set params and add listeners', () => {
      component.agInit((params as unknown) as IStatusPanelParams);

      expect(component['params']).toEqual(params);

      expect(params.api.addEventListener).toHaveBeenCalledTimes(2);
    });
  });

  describe('onGridReady', () => {
    test('should set selections', () => {
      component['params'] = params;
      component.onGridReady();

      expect(params.api.getSelectedRows).toHaveBeenCalled();
    });
  });

  describe('onSelectionChange', () => {
    test('should set selections', () => {
      component['params'] = params;
      component.onSelectionChange();

      expect(params.api.getSelectedRows).toHaveBeenCalled();
    });
  });

  describe('addToOffer', () => {
    test('should addToOffer', () => {
      console.log = jest.fn();

      component.addToOffer();

      expect(console.log).toHaveBeenCalled();
    });
  });
});
