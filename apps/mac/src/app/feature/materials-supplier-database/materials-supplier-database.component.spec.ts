import { CommonModule } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { UnderConstructionModule } from '@schaeffler/empty-states';

import { MaterialsSupplierDatabaseRoutingModule } from './materials-supplier-database-routing.module';
import { MaterialsSupplierDatabaseComponent } from './materials-supplier-database.component';

describe('MaterialsSupplierDatabaseComponent', () => {
  let component: MaterialsSupplierDatabaseComponent;
  let spectator: Spectator<MaterialsSupplierDatabaseComponent>;

  const createComponent = createComponentFactory({
    component: MaterialsSupplierDatabaseComponent,
    imports: [
      CommonModule,
      MaterialsSupplierDatabaseRoutingModule,
      UnderConstructionModule,
    ],
    declarations: [MaterialsSupplierDatabaseComponent],
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaterialsSupplierDatabaseComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
