import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PushModule } from '@ngrx/component';
import { MockModule } from 'ng-mocks';

import { QuotationByProductLineComponent } from './quotation-by-product-line.component';

describe('QuotationByProductLineComponent', () => {
  let component: QuotationByProductLineComponent;
  let spectator: Spectator<QuotationByProductLineComponent>;

  const createComponent = createComponentFactory({
    component: QuotationByProductLineComponent,
    imports: [MockModule(PushModule)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
